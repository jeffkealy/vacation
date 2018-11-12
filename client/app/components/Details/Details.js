import React, { Component } from 'react';
import 'whatwg-fetch';
import Calendar from 'react-calendar';
import Entries from '../Details/Entries';
import {FaAngleDown} from 'react-icons/fa';
import {FaAngleUp} from 'react-icons/fa';


class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person:{},
      startDate: new Date,
      endDate: new Date(),
      startDateClicked: false,
      endDateClicked: false,
      hoursToBeUsed: 0,
      note: "",
      hidden: false,
      vacationHoursUsed:0
    };
    this.addVacationDates = this.addVacationDates.bind(this);
    this.dateSet = this.dateSet.bind(this);
    this.calculateHours = this.calculateHours.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.updateVacationDaysPerYear = this.updateVacationDaysPerYear.bind(this);
    this.calculateHoursUsed = this.calculateHoursUsed.bind(this);
    this.hoursCalculations = this.hoursCalculations.bind(this);
    this.calculateOneOffAdditions = this.calculateOneOffAdditions.bind(this);
  }

  componentWillMount(){

  }

  componentDidMount() {
    let id = this.props.person.name
    fetch(`/api/person/${id}`, {method: 'PUT'})
      .then(res => res.json())
      .then(json => {
        console.log("componentDidMount", json);
        this.setState({
          person: json
        });
      });
  }

  dateSet(date){
    this.setState({
      startDate: date[0],
      endDate:date[1],
      hoursToBeUsed: this.calculateHours(date)

    })
  }
  calculateHours(date){
    console.log("calculate hours");
    if (date[0] && date[1]) {
      let startDate_ms = date[0].getTime()
      let endDate_ms = date[1].getTime()
      let one_day=1000*60*60*24;
      let difference_ms =endDate_ms- startDate_ms;
      let days_ms = difference_ms/one_day
      return Math.round((difference_ms/one_day)*8);
    } else{
      return 0
    }
  }
  addVacationDates(){
    let beginningOfDayStartDate = this.state.startDate.setHours(0,0,0,0)
    let beginningOfDayEndDate = this.state.endDate.setHours(0,0,0,0)
    beginningOfDayStartDate = new Date(beginningOfDayStartDate)
    beginningOfDayEndDate = new Date(beginningOfDayEndDate)
    this.setState({
      startDate: beginningOfDayStartDate,
      endDate: beginningOfDayEndDate,
    });
    const id = this.state.person._id;
    const data =
    { vacationHoursRemaining: this.state.person.vacationHoursRemaining - this.state.hoursToBeUsed,
      entry:{
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        hoursUsed: this.state.hoursToBeUsed,
        note: this.state.note
      }
    }
    console.log("addVacationDates data", data);

    fetch(`/api/people/${id}/entry`,
      { method: 'PUT',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
          this.setState({
            person: json,
            note: ""
          })
      });
  }
  deleteEntry(entries, i){
    const id = this.state.person._id;
    const data = {
      entryID:this.state.person.entries[i]._id,
      vacationHoursRemaining: this.state.person.vacationHoursRemaining + entries.hoursUsed,
    }
    console.log(data);
    fetch(`/api/people/${id}/delete`,
      {
        method:'DELETE',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    .then(res => res.json())
    .then(json => {
      this.setState({
        person: json
      })
        console.log(json);
    });
  }
  updateVacationDaysPerYear(person, e){
    console.log("updateVacationDaysPerYear", person._id, e);
    if (!e) {
      return
    } else {

      fetch(`/api/people/${person._id}/hoursPerCycle/${e}`,
        { method: 'PUT',
          headers: {'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'},
        })
        .then(res => res.json())
        .then(json => {
          console.log("hoursPerCycle", json);
        });
    }
  }
  calculateHoursUsed(person){
    let vacationHoursUsed = 0
    if(person.entries){
      for (let i = 0; i < person.entries.length; i++) {
        vacationHoursUsed = vacationHoursUsed + person.entries[i].hoursUsed
      }
      console.log("vacation days, hours used", vacationHoursUsed, person.vacationHoursRemaining);
     return (vacationHoursUsed)
   } else return "Could not calculate hours"
  }
  hoursCalculations(person){
    if(person.name){
      let today = new Date().setHours(0,0,0,0);
      let beginDate = new Date(person.beginDate).getTime();
      let hoursAccruedPerDay = (person.vacationHoursPerYear/8)/365;
      today = new Date(today)
      beginDate = new Date(beginDate)
      let todayTimezoneOffset = new Date(today).getTimezoneOffset()
      let beginDateTimezoneOffset = new Date(beginDate).getTimezoneOffset()
      let timezoneOffset = (todayTimezoneOffset - beginDateTimezoneOffset)/60
      //Vacation hours used
      let hoursUsed = this.calculateHoursUsed(person)
      console.log("hoursCalculations", today, beginDate, timezoneOffset);
      //hours person has been with company as of start date
      let hoursHere = ((today - beginDate)/1000/60/60)-timezoneOffset;
      let hoursAccruedSinceStart = hoursAccruedPerDay*hoursHere + this.calculateOneOffAdditions(person)
      let endOfYear = new Date((new Date().getFullYear()),11,31).setHours(23,59,59,999);
      let hoursLeftInTheYear = (endOfYear - new Date().getTime())/1000/60/60;
      console.log("calculateHoursUsed", this.calculateHoursUsed(person));
      console.log();
      console.log("hoursLeftInTheYear",hoursLeftInTheYear);
      console.log("hoursAccruedPerDay", hoursAccruedPerDay);
      console.log("hourshere", hoursHere);
      console.log("yearend", hoursHere+hoursLeftInTheYear);
      console.log("daysRemaining", hoursAccruedPerDay,hoursHere, hoursUsed,hoursAccruedPerDay*hoursHere ,Math.round(((hoursAccruedPerDay*hoursHere/24)*100)/100)-hoursUsed/8);
      return {
        daysRemaining:Math.round((hoursAccruedPerDay*hoursHere/24-hoursUsed)*100)/100,
        daysAccruedSinceStart: Math.round((hoursAccruedSinceStart/24)*100)/100,
        yearEndDaysAccrued:Math.round((hoursAccruedPerDay*(hoursHere+hoursLeftInTheYear)/24)*1000)/1000

      }
    } else return{
                  daysRemaining:"daysRemaining: no data returned",
                  daysAccruedSinceStart:"No Data Returned",
                  yearEndDaysAccrued:"No Data Returned"
                }


  }
  calculateOneOffAdditions(person){
    if(person.oneOffAdditions){

      let oneOffAdditionHours = 0

      for (var i = 0; i < person.oneOffAdditions.length; i++) {
        oneOffAdditionHours = oneOffAdditionHours + person.oneOffAdditions[i].add

      }
      console.log("oneOffAdditionHours", oneOffAdditionHours);
      return oneOffAdditionHours/8
    }
    else return null
  }
  render() {
    return (
      <>
          <div className="details">
            <div className="details title">
              <h1>{this.state.person.name}</h1>
              <h3>Start Date:</h3>
              {this.state.person.beginDate ?
                <h4>{new Date(this.state.person.beginDate).toLocaleDateString("en-US")}</h4>
              :null}
            </div>

            {this.state.person.name === "Phil"?
              <div className="admin">
                <h2>Admin</h2>
                <h3>Vacation days per year</h3>
                <div className="admin-input-container">
                  {this.props.people.map((people, i)=>(
                    <label key={i}><span className="label">{people.name}</span>
                      <input
                        value={this.state.vacationHoursPerYear}
                        type="number"
                        placeholder={people.vacationHoursPerYear/8}
                        onChange={(e)=>this.updateVacationDaysPerYear(people, e.target.value)}
                        className="input-1"
                        min="0"
                      />
                    </label>

                  ))}
                </div>
              </div>
            :null}
            <div className="vacation-days-details container">
              <h2 className="vacation-days-details-header"> Vacation Days</h2>
              <div className="detail-group first">
                <div className="detail-container remaining">
                  <h4>Remaining </h4>
                  <h3>  {(((this.state.person.vacationHoursPerYear) - this.calculateHoursUsed(this.state.person))/8)+ this.calculateOneOffAdditions(this.state.person)}</h3>
                </div>
                <div className="detail-container used">
                  <h4>Used </h4>
                  <h3>  {this.calculateHoursUsed(this.state.person)/8}</h3>
                </div>
              </div>
              <div className="detail-group second">
                <h2>Accrued</h2>
                <div className="detail-container accrued monthly">
                  <h4>Monthly </h4>
                  <h3>  {Math.round((this.state.person.vacationHoursPerYear/8/12) * 1000) / 1000}</h3>
                </div>
                <div className="detail-container accrued annually">
                  <h4>Annually </h4>
                  <h3>  {this.state.person.vacationHoursPerYear/8}</h3>
                </div>
                <div>
                  <div className="detail-container total-accrued">
                    <h4>Since start date </h4>
                    <h3> {Math.ceil((this.hoursCalculations(this.state.person).daysAccruedSinceStart)*2)/2}</h3>
                  </div>
                  <div className="detail-container total-accrued">
                    <h4>Since start date to EOY </h4>
                    <h3> {Math.ceil((this.hoursCalculations(this.state.person).yearEndDaysAccrued*2)/2)}</h3>
                  </div>
                </div>
              </div>
              <div className="detail-container accrued annually">
                <h4>Left by EOY </h4>
                <h3>  {((this.state.person.vacationHoursPerYear) - this.calculateHoursUsed(this.state.person))/8}</h3>
              </div>

            </div>
            <div className="view-entry">
              <button onClick={()=>this.setState({hidden: !this.state.hidden})} className="show-table"><span>Entries</span><FaAngleDown className={this.state.hidden? "arrow hidden": "arrow"} /><FaAngleUp className={this.state.hidden? "arrow": "arrow hidden"} /></button>
                {this.state.person.entries ?
                  <table className={this.state.hidden? "view-entry-table": "view-entry-table hidden"}>
                    <tbody>
                      <tr>
                        <th></th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Hours used</th>
                        <th>Note</th>
                      </tr>
                      {this.state.person.entries.map((entries, i) =>(
                        <tr key={i}>
                          <td><button onClick={()=>this.deleteEntry(entries, i)} className="delete-button">x</button></td>
                          <td className="start-date">{new Date(entries.startDate).toLocaleDateString("en-US")}</td>
                          <td className="endDate-date">{new Date(entries.endDate).toLocaleDateString("en-US")}</td>
                          <td className="hours-used">{entries.hoursUsed}</td>
                          <td className="entry-note">{entries.note}</td>
                        </tr>
                      ))}
                  </tbody>
                </table> : <span>No Entries</span>
                }
            </div>
            <div className="add-entry">
              <div className="add-entry calendar">
                <h2 className="add-entry-title">Add Entry:</h2>
                <Calendar
                  value={this.state.startDate}
                  onChange={d => this.dateSet(d)}
                  minDetail = {"year"}
                  selectRange={true}
                  showWeekNumbers={true}
                  onClickDay={(value) => console.log('Clicked day: ', value)}
                  onDrillDown={(value) => console.log(':onDrillDown ', value)}
                  tileClassName="tile"
                />
              </div>

              <div className="add-entry-preview">
                <div>
                  <h3>{this.state.startDate.toLocaleDateString("en-US")} </h3>
                    to
                  <h3> {this.state.endDate.toLocaleDateString("en-US")}</h3>
                </div>
                <div className="hours-used">
                  <span>Entry used:</span>
                  <span className="hours"> {this.state.hoursToBeUsed}</span>
                </div>
                <label> <span className="note-input-label">Note:</span>
                  <input
                    value={this.state.note}
                    type="string"
                    onChange={(e)=>this.setState({note:e.target.value})}
                    className="add-entry input-1"
                    min="0"
                  />
                </label>
              </div>
              <button onClick={this.addVacationDates}className="add-entry-button" >Add</button>
            </div>
          </div>

      </>
    );
  }
}


export default Details;
