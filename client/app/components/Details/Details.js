import React, { Component } from 'react';
import 'whatwg-fetch';
import Calendar from 'react-calendar';
import {FaAngleDown} from 'react-icons/fa';
import {FaAngleUp} from 'react-icons/fa';
import PTODays from '../Modules/PTODays'



class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date,
      endDate: new Date(),
      hoursToBeUsed: 0,
      note: "",
      hidden: false,
      showHalfDay: false,
      halfDaySubtracted: false,
      subtractHalfDayHours:0,
      entryApproved: false,
      updateVacationHoursPerYear: "",
      oneOffHours: "",
      oneOffNote:"",
      key:0

    };
    this.dateSet = this.dateSet.bind(this);
    this.setSubtractHalfDayHours = this.setSubtractHalfDayHours.bind(this);
    this.subtractHalfDayHours = this.subtractHalfDayHours.bind(this);
    this.addVacationDates = this.addVacationDates.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.addOneOffEntry = this.addOneOffEntry.bind(this);
    this.deleteOneOffEntry = this.deleteOneOffEntry.bind(this);
    this.updateVacationDaysPerYear = this.updateVacationDaysPerYear.bind(this);
    this.entryApproved = this.entryApproved.bind(this);
  }


  componentDidMount() {
    let email = this.props.person.email;
    fetch(`/api/person/${email}`, {method: 'PUT'})
      .then(res => res.json())
      .then(json => {
        json.entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
        this.setState({
          person: json,
          key:this.state.key+1,
          entryKey:this.state.entryKey+1
        });
        console.log("Details.js componentDidMount json", json);
        console.log("#####",this.state.person);
      });
    // let person = this.props.person;
    // person.entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
    // console.log(person);
    //   this.setState({
    //     person: person
    //   }
    // })
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
        hoursToBeUsed: Math.round(((endDate - startDate)/one_day)*8),
        showHalfDay: true
      })
    } else {
      this.setState({
        startDate: startDate,
        endDate:endDate,
        hoursToBeUsed: Math.round(((endDate - startDate)/one_day)*8),
        showHalfDay: true

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

  subtractHalfDayHours(){
    this.setState({halfDaySubtracted: !this.state.halfDaySubtracted},()=>{
      this.setSubtractHalfDayHours();
    });
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
    fetch(`/api/people/${id}/entry`,
      { method: 'PUT',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
          json.entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
          this.setState({
            person: json,
            note: "",
            showHalfDay:false,
            key:this.state.key+1
          })
          this.props.refreshApproval();
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
      json.entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
      this.setState({
        person: json,
        key:this.state.key+1

      })
      this.props.refreshApproval();
        console.log(json);
    });
  }

  addOneOffEntry(){
    let id = this.state.person._id
    let data = {
      oneOffHours:this.state.oneOffHours*8,
      note: this.state.oneOffNote,
      date: new Date()
    }
    fetch(`/api/people/${id}/addOneOff`,
      { method: 'PUT',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
          this.setState({
            person: json,
            oneOffNote: "",
            oneOffHours: "",
            key:this.state.key+1
          })
      });
  }

  deleteOneOffEntry(entry){
    console.log(entry);
    let id = this.state.person._id
    fetch(`/api/people/${id}/deleteOneOff`,
      {
        method:'DELETE',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(entry)
      })
    .then(res => res.json())
    .then(json => {
      this.setState({
        person: json,
        key:this.state.key+1
      })
    });
  }

  updateVacationDaysPerYear(){
      console.log("updateVacationDaysPerYear", this.state.person._id, this.state.updateVacationHoursPerYear);
      if (!this.state.updateVacationHoursPerYear) {
        return
      } else {
        let person = this.state.person;
        let e = this.state.updateVacationHoursPerYear;
        fetch(`/api/people/${person._id}/hoursPerCycle/${e}`,
          { method: 'PUT',
            headers: {'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json'},
          })
          .then(res => res.json())
          .then(json => {
            console.log("hoursPerCycle", json);
            this.setState({
              person: json,
              updateVacationHoursPerYear: "",
              key:this.state.key+1

            })
          });
      }
  }

  entryApproved(){
    return true
  }

  render() {
    return (
      <>

          {this.state.person ?
            <div className="details-container">

            <div className="details-title">
              <h1>{this.state.person.name} {this.state.person.lastName}</h1>
              <h3>Start Date:
                {this.state.person.beginDate ?
                  <span> {new Date(this.state.person.beginDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</span>
                :null}
              </h3>
            </div>

            <PTODays person={this.state.person} key={this.state.key}/>

            <div className="admin-vacation-hours-per-year container">
              <div className="white-header">
                <h2>PTO days per year</h2>
              </div>
              <h4 className="vacation-hours-per-year">{this.state.person.vacationHoursPerYear/8}</h4>
              <div className="hours-per-year-update">
                <label><span className="update-label">Update</span>
                   <input
                     value={this.state.updateVacationHoursPerYear}
                     type="number"
                     onChange={(e)=>this.setState({updateVacationHoursPerYear:e.target.value})}
                     className="update-vacation-hours-input"
                     min="0"
                     placeholder=" "
                   />
                 </label>
                 <button className="update-vacation-submit-button back-button action-button" onClick={()=>this.updateVacationDaysPerYear()}>Submit</button>
              </div>
            </div>
            <div className="admin-oneOffs container">
              <div className="white-header">
                <h2>Add/Subtract</h2>
              </div>
              <h5>Add or subtract one off hours. Use negative number to stubtract</h5>
                <label> Days
                  <input
                    value = {this.state.oneOffHours}
                    className='oneOff-days-input'
                    type="number"
                    onChange={(e)=>this.setState({oneOffHours:e.target.value})}
                    />
                </label>
                <label> Note
                  <input
                    value = {this.state.oneOffNote}
                    className='oneOff-note-input'
                    type="text"
                    onChange={(e)=>this.setState({oneOffNote:e.target.value})}
                    />
                </label>
                  <button onClick={()=>this.addOneOffEntry()} className='submit-button action-button'>Submit</button>

                <table className="admin-oneOffs-table">
                  <tbody>
                    <tr>
                      <th></th>
                      <th className="th-date">Date</th>
                      <th>Days</th>
                      <th>Note</th>
                    </tr>
                    {this.state.person.oneOffAdditions.map((entries, i) =>(
                      <tr key={i}>
                        <td><button onClick={()=>this.deleteOneOffEntry(entries, i)} className="delete-button">x</button></td>
                        <td className="oneOffs-date">{new Date(entries.date).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                        <td className="oneOffs-hours">{entries.oneOffHours/8}</td>
                        <td className="oneOffs-note">{entries.note}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>


            <div className="view-entry container">
              <div className="white-header">
                <h2>PTO Entries</h2>
              </div>
              <h3 className="black-header">Awaiting Approval</h3>
              <div className="view-entry-table awaiting content">
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

                    {this.state.person.entries.map(
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
              <div className={this.state.hidden? "view-entry-table approved active content": "view-entry-table approved content "}>
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
                    {this.state.person.entries.map((entries, i) =>(
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
                  returnValue="range"
                />

              </div>
              <div className={this.state.showHalfDay?"subtract-half-day" : "hidden"}>
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
                <div className="add-entry-details content">
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
              <button onClick={this.addVacationDates}className="add-entry-button action-button" >Add</button>
            </div>
          </div>
        :null}

      </>
    );
  }
}


export default Details;
