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
      startDate: new Date,
      endDate: new Date(),
      hoursToBeUsed: 0,
      note: "",
      hidden: false,
      vacationHoursUsed:0,
      halfDaySubtracted: false,
      subtractHalfDayHours:0,
      entryApproved: false
    };
    this.addVacationDates = this.addVacationDates.bind(this);
    this.dateSet = this.dateSet.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.calculateHoursUsed = this.calculateHoursUsed.bind(this);
    this.hoursCalculations = this.hoursCalculations.bind(this);
    this.calculateOneOffAdditions = this.calculateOneOffAdditions.bind(this);
    this.timezoneOffsetHours = this.timezoneOffsetHours.bind(this);
    this.subtractHalfDayHours = this.subtractHalfDayHours.bind(this);
    this.setSubtractHalfDayHours = this.setSubtractHalfDayHours.bind(this);
    this.entryApproved = this.entryApproved.bind(this);
    this.calculateHalfDays = this.calculateHalfDays.bind(this);




  }


  componentDidMount() {
    let id = this.props.person.name
    fetch(`/api/person/${id}`, {method: 'PUT'})
      .then(res => res.json())
      .then(json => {
        this.setState({
          person: json
        });
        console.log("componentDidMount json", json);
        this.hoursCalculations(json)
        console.log("#####",this.state.person);
      });
  }

  dateSet(date){
    console.log(date);
    let startDate
    let endDate
    let subtractHalfDayHours
    let one_day=1000*60*60*24;
    startDate = date[0]
    endDate = date[1]
    if (new Date(endDate) < new Date(startDate)) {
      startDate = new Date(date[1].setHours(0,0,0,0));
      endDate = new Date(date[0].setHours(23,59,59,999));
      this.setState({
        startDate: startDate,
        endDate:endDate,
        hoursToBeUsed: Math.round(((endDate - startDate)/one_day)*8)
      })
    } else {
      this.setState({
        startDate: startDate,
        endDate:endDate,
        hoursToBeUsed: Math.round(((endDate - startDate)/one_day)*8)
      })
    }

  }
  setSubtractHalfDayHours(item){
    console.log("setSubtractHalfDayHours", item);
    if (this.state.halfDaySubtracted) {
      this.setState({
        subtractHalfDayHours: -4,
        hoursToBeUsed: this.state.hoursToBeUsed
      });
      return -4
    } else{
      this.setState({subtractHalfDayHours: 0,
        hoursToBeUsed: this.state.hoursToBeUsed
      });
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
    { vacationHoursRemaining: this.state.daysRemaining*8,
      entry:{
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        hoursUsed: this.state.hoursToBeUsed,
        note: this.state.note,
        subtractHalfDayHours: this.state.subtractHalfDayHours,
        approved: false
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
          this.hoursCalculations(json)
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
        this.hoursCalculations(json)
    });
  }
  calculateHoursUsed(person){
  if(person.entries){
    let hoursUsed = {
      total: 0,
      thisYear: 0,
      lastYear:0
    }
    let totalHalfDays = 0;
    let thisYearHalfDays = 0;
    let lastYearHalfDays = 0;

    let currentYear = new Date()
      for (let i = 0; i < person.entries.length; i++) {
        let startDateYear = new Date(person.entries[i].startDate).getFullYear()
        let endDateYear = new Date(person.entries[i].endDate).getFullYear()

        hoursUsed.total = hoursUsed.total + person.entries[i].hoursUsed
        totalHalfDays = totalHalfDays + person.entries[i].subtractHalfDayHours
        if (startDateYear === new Date().getFullYear()
            && endDateYear === new Date().getFullYear()
            && startDateYear === endDateYear) {
            hoursUsed.thisYear = hoursUsed.thisYear + person.entries[i].hoursUsed
            thisYearHalfDays = thisYearHalfDays + person.entries[i].subtractHalfDayHours
        } else if(startDateYear === new Date().getFullYear()-1
                  && endDateYear === new Date().getFullYear()-1) {
                  lastYearHalfDays = lastYearHalfDays + person.entries[i].subtractHalfDayHours
                  hoursUsed.lastYear = hoursUsed.lastYear + person.entries[i].hoursUsed


        } else{

        }
      }
      hoursUsed.total = hoursUsed.total + totalHalfDays;
      hoursUsed.thisYear = hoursUsed.thisYear + thisYearHalfDays;
      hoursUsed.lastYear = hoursUsed.lastYear + lastYearHalfDays;
      // console.log("half lastYearDays", lastYearHalfDays);
      // console.log("half thisYearDays", thisYearHalfDays);
      // console.log("half totalDays", totalHalfDays);
     return (hoursUsed)
   } else return "Could not calculate hours"
  }
  hoursCalculations(person){
    if(person.name){
      let today = new Date().setHours(0,0,0,0);
      today = new Date(today)
      let beginDate = new Date(person.beginDate).setHours(0,0,0,0);
      beginDate = new Date(beginDate)
      let endOfYear = new Date((today.getFullYear()),11,31).setHours(23,59,59,999);
      let startOfYear = new Date(today.getFullYear(),0,1);
      let currentYear = new Date(today).getFullYear();
      let hoursAccruedPerDay = (person.vacationHoursPerYear/8)/365;
      console.log("today",today, beginDate);
      let hoursUsed = this.calculateHoursUsed(person);  //Vacation hours used
      let oneOffAdditionDays = this.calculateOneOffAdditions(person)/8 //one off additions hours converted to days
      let hoursHere = ((today - beginDate)/1000/60/60)+(this.timezoneOffsetHours(beginDate,today)); //hours person has been with company as of start date
      let hoursAccruedSinceStart = hoursAccruedPerDay*hoursHere;
      let hoursLeftInTheYear = (endOfYear - today.getTime()+this.timezoneOffsetHours(today.getTime(),endOfYear))/1000/60/60;
      let hoursThisYear = (today - startOfYear +this.timezoneOffsetHours(startOfYear.getTime(), today.getTime()))/1000/60/60;
      let hoursWorkedLastYear
      let hoursWorkedThisYear = hoursThisYear
      if (beginDate.getFullYear() === currentYear-1) {
          hoursWorkedLastYear = ((new Date(currentYear-1,11,31).setHours(23,59,59,999))-beginDate)/1000/60/60+this.timezoneOffsetHours(new Date(currentYear-1,11,31).setHours(23,59,59,999),beginDate);
          hoursWorkedLastYear = Math.round(hoursWorkedLastYear)
          console.log("###In 2nd year hoursWorkedLastYear",hoursWorkedLastYear);
      } else if(beginDate.getFullYear() === currentYear){
        hoursWorkedThisYear = ((today-beginDate)/1000/60/60)+this.timezoneOffsetHours(endOfYear,beginDate);
        hoursWorkedLastYear = 0;
        console.log("In 1st year. Worked",today, beginDate,(today-beginDate)/1000/60/60);
      } else {
        console.log("in 3rd year", new Date(currentYear), beginDate.getFullYear());
        hoursWorkedLastYear = 8760
      }

      let daysAccruedSinceStart = (Math.ceil((hoursAccruedSinceStart/24)*2)/2)+oneOffAdditionDays;
      let daysAccruedlastYear = (Math.ceil(((hoursWorkedLastYear/24)*hoursAccruedPerDay)-hoursUsed.lastYear/8)*2)/2
      if (daysAccruedlastYear > 5) {daysAccruedlastYear=5}
      if (daysAccruedlastYear < 0) {daysAccruedlastYear=0}
      let daysRemainingEOY = (person.vacationHoursPerYear/8)+oneOffAdditionDays+daysAccruedlastYear
      let useByEndOfYear = (Math.ceil((hoursAccruedPerDay*(hoursHere+hoursLeftInTheYear)/24)*2)/2)+oneOffAdditionDays-(hoursUsed.total/8)-5
      if (useByEndOfYear < 0) {useByEndOfYear =0 }
      console.log("hoursUsed.thisYear", hoursUsed.thisYear);
      this.setState({
        hoursUsedThisYear: hoursUsed.thisYear,
        daysRemaining:(Math.ceil((hoursAccruedPerDay*(hoursHere/24)*2)/2-(hoursUsed.total/8))+oneOffAdditionDays),
        daysRemainingEOY: daysRemainingEOY-hoursUsed.thisYear/8,
        daysLeftFromLastYear: daysAccruedlastYear,
        daysAccruedThisYear: (Math.ceil((hoursAccruedPerDay)*hoursWorkedThisYear/24)*2)/2,
        yearEndDaysAccrued:(person.vacationHoursPerYear/8)+oneOffAdditionDays+daysAccruedlastYear,
        useByEndOfYear: useByEndOfYear
      })
    } else return


  }
  calculateOneOffAdditions(person){
    if(person.oneOffAdditions){
      let oneOffAdditionHours = 0
      for (var i = 0; i < person.oneOffAdditions.length; i++) {
        oneOffAdditionHours = oneOffAdditionHours + person.oneOffAdditions[i].oneOffHours
      }
      return oneOffAdditionHours
    }
    else return null
  }
  calculateHalfDays(person){

    let halfDayHours = 0
    for (var i = 0; i < person.entries.length; i++) {
      halfDayHours = halfDayHours + person.entries[i].subtractHalfDayHours
    }
    return halfDayHours
  }
  timezoneOffsetHours(earlier, later){
    let earlierOffset = new Date(earlier).getTimezoneOffset()
    let laterOffset= new Date(later).getTimezoneOffset()
    let timezoneDifference = earlierOffset - laterOffset;
    return timezoneDifference/60
  }
  subtractHalfDayHours(){
    this.setState({halfDaySubtracted: !this.state.halfDaySubtracted},()=>{
      this.setSubtractHalfDayHours();
    });
  }
  entryApproved(){
    return true
  }

  render() {
    return (
      <>

          {this.state.person ?
            <div className="details">

            <div className="details-title">
              <h1>{this.state.person.name} {this.state.person.lastName}</h1>
              <h3>Start Date:
                {this.state.person.beginDate ?
                  <span> {new Date(this.state.person.beginDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</span>
                :null}
              </h3>
            </div>



            <div className="vacation-days-details container">
              <div className="white-header">
                <h2 className="vacation-days-details-header "> PTO Days</h2>
              </div>
              <div className="detail-group top">
                <div className="detail-container used">
                  <h4>Used </h4>
                    <h3> {this.state.hoursUsedThisYear/8}</h3>
                </div>
                <div className="detail-container remaining">
                  <h4>Remaining </h4>
                  <h3>{this.state.daysRemainingEOY}</h3>
                </div>
              </div>
              <div className="detail-group accrued">
                <h2>Accrued</h2>
                <div className="content">
                  <div className="detail-containr-top">
                    <div className="detail-container total-accrued">
                      <h4> This year </h4>
                      <h3> {this.state.daysAccruedThisYear}</h3>
                    </div>
                    <div className="detail-container total-accrued">
                      <h4>From {new Date().getFullYear() - 1}</h4>
                      <h3> {this.state.daysLeftFromLastYear}</h3>
                    </div>
                    <div className="detail-container total-accrued">
                      <h4>By End Of Year</h4>
                      <h3> {this.state.yearEndDaysAccrued}</h3>
                    </div>
                  </div>
                  <div className="detail-container accrued monthly">
                    <h4>Monthly </h4>
                    <h3>  {Math.round((this.state.person.vacationHoursPerYear/8/12) * 1000) / 1000}</h3>
                  </div>
                  <div className="detail-container accrued annually">
                    <h4>Annually </h4>
                    <h3>  {this.state.person.vacationHoursPerYear/8}</h3>
                  </div>
                </div>
                <div className="detail-container remaining">
                  <h5>5 hours of PTO can be rolled over to the next year <br></br> so you'll need to use</h5>
                  <h3>{this.state.useByEndOfYear} days</h3>
                  <h5>by the end of the year</h5>
                </div>

              </div>
            </div>
            <div className="view-entry container">
              <div className="white-header">
                <h2>PTO Entries</h2>
              </div>
              <h3 className="black-header">Awaiting Approval</h3>
              <div className="view-entry-table awaiting">
                <table >
                  <thead>
                      <tr>
                        <th></th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days used</th>
                        <th>Note</th>
                      </tr>
                    </thead>

                    {this.state.person.entries.sort((a,b)=>(a.startDate-b.startDate)).map(
                      (entries, i) =>(
                    <tbody key={i}>
                      {entries.approved===false?
                      <tr>
                        <td><button onClick={()=>this.deleteEntry(entries, i)} className="delete-button">x</button></td>
                        <td className="start-date">{new Date(entries.startDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                        <td className="endDate-date">{new Date(entries.endDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                        <td className="days-used">{(entries.hoursUsed+entries.subtractHalfDayHours)/8}</td>
                        <td className="entry-note">{entries.note}</td>
                      </tr>
                      :null}
                    </tbody>
                    ))}

                </table>
              </div>
              <button onClick={()=>this.setState({hidden: !this.state.hidden})} className="show-table">
                <h3 className="black-header">All
                  <FaAngleDown className={this.state.hidden? "arrow hidden": "arrow"} />
                  <FaAngleUp className={this.state.hidden? "arrow": "arrow hidden"} />
                </h3>
              </button>

              {this.state.person.entries ?
              <div className={this.state.hidden? "view-entry-table approved": "view-entry-table approved hidden"}>
                <table >
                    <thead>
                      <tr>
                        <th></th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days used</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    {this.state.person.entries.sort((a,b)=>(a.startDate-b.startDate)).map((entries, i) =>(
                      <tbody key={i}>
                        <tr className={entries.approved === false? "red-background": ""}>
                          <td><button onClick={()=>this.deleteEntry(entries, i)} className="delete-button">x</button></td>
                          <td className="start-date">{new Date(entries.startDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                          <td className="endDate-date">{new Date(entries.endDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                          <td className="days-used">{(entries.hoursUsed+entries.subtractHalfDayHours)/8}</td>
                          <td className="entry-note">{entries.note}</td>
                        </tr>
                      </tbody>
                    ))}
                </table>
              </div>
              :<span>No Entries</span>
              }
            </div>
            <div className="add-entry container">
              <div className="add-entry calendar">
                <div className="white-header">
                  <h2 className="add-entry-title">Add PTO</h2>
                </div>
                <Calendar
                  onChange={d => this.dateSet(d)}
                  minDetail = {"year"}
                  selectRange={true}
                  showWeekNumbers={true}
                  tileClassName="calendar-tile"
                />

              </div>
              <div className="subtract-half-day">
                <label><span>Subtract Half Day</span>
                <input
                  className="checkbox"
                  type="checkbox"
                  value={this.state.halfDaySubtracted}
                  onChange={(e)=>this.subtractHalfDayHours(e.target.value)}

                />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="add-entry-preview">
                <div className="hours-used">
                  <span>Using </span>
                  <span className="hours"> {(this.state.hoursToBeUsed+this.state.subtractHalfDayHours)/8 < 0 ? 0 : (this.state.hoursToBeUsed+this.state.subtractHalfDayHours)/8}</span>
                  <span> Days</span>
                </div>
                <div className="add-entry-details">
                  <h3>{this.state.startDate.toLocaleDateString("en-US")} </h3>
                    to
                  <h3> {this.state.endDate.toLocaleDateString("en-US")}</h3>
                  <label>
                    <input
                      value={this.state.note}
                      type="string"
                      onChange={(e)=>this.setState({note:e.target.value})}
                      className="add-entry-note"
                      min="0"
                      placeholder="Add Note"
                    />
                  </label>
                </div>
              </div>
              <button onClick={this.addVacationDates}className="add-entry-button" >Add</button>
            </div>
          </div>
        :null}

      </>
    );
  }
}


export default Details;
