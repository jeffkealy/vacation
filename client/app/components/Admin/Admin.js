import React, { Component } from 'react';
import 'whatwg-fetch';
import {TiThumbsUp} from 'react-icons/ti';


class Admin extends Component{
  constructor(props) {
    super(props);

    this.state={
      employeeSelected:{},
      updateVacationHoursPerYear: "",
      oneOffHours: "",
      oneOffNote:""
    };
    this.updateVacationDaysPerYear = this.updateVacationDaysPerYear.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteOneOffEntry = this.deleteOneOffEntry.bind(this);
    this.addOneOffEntry = this.addOneOffEntry.bind(this);
    this.approveEntry = this.approveEntry.bind(this);


  }
componentDidMount(){
  fetch(`/api/person/names`)
  .then(res => res.json())
  .then(json =>{
    json.sort((a,b) => {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    for (var i = 0; i < json.length; i++) {
      json[i].entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
    }
    console.log("GET People", json);

    this.setState({
      people:json
    });
  })
}
updateVacationDaysPerYear(){
    console.log("updateVacationDaysPerYear", this.state.employeeSelected._id, this.state.updateVacationHoursPerYear);
    if (!this.state.updateVacationHoursPerYear) {
      return
    } else {
      let person = this.state.employeeSelected;
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
            employeeSelected: json,
            updateVacationHoursPerYear: ""

          })
        });
    }
}
addOneOffEntry(){
  let id = this.state.employeeSelected._id
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
          employeeSelected: json,
          oneOffNote: "",
          oneOffHours: ""
        })
    });
}
deleteOneOffEntry(entry){
  console.log(entry);
  let id = this.state.employeeSelected._id
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
      employeeSelected: json
    })
  });
}
approveEntry(entry){
  let id = entry._id
  console.log(entry);
  fetch(`/api/approve/${id}/`,
    { method: 'PUT',
      headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(json => {
      fetch(`/api/person/names`)
      .then(res => res.json())
      .then(json =>{
        json.sort((a,b) => {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
        for (var i = 0; i < json.length; i++) {
          json[i].entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
        }
        console.log("GET People", json);
        this.setState({
          people:json
        });
      })
    });
}
handleChange(e){
  this.setState({
    employeeSelected: this.props.people[e]
  })
}

render(){
  return(
      <div className="admin-container ">
        <div className="admin-apporval container">
          <div className="white-header">
            <h2>Approval Needed</h2>
          </div>
          {this.state.people ?
          <table >
            <thead>
              <tr>
                <th className="name">Name</th>
                <th className="start-date">Start</th>
                <th className="end-date">End</th>
                <th>Days</th>
                <th>Note</th>
                <th>Approve</th>
              </tr>
            </thead>
            {[].concat(this.state.people).sort((a,b)=>(a.startDate-b.startDate)).map((people, i) =>(
              <tbody key={i} >
              {people.entries.map((entries,i2)=>(
              <tr key={i2} className={entries.approved === false ? "": "hidden"}>
                <td className="name"><span>{people.name}</span> <span>{people.lastName}</span></td>
                <td className="start-date">{new Date(entries.startDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                <td className="end-date">{new Date(entries.endDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</td>
                <td className="days-used">{(entries.hoursUsed+entries.subtractHalfDayHours)/8}</td>
                <td className="entry-note">{entries.note}</td>
                <td className="td-approval"><button onClick={()=>this.approveEntry(entries, i)} className=" approval-button"><TiThumbsUp className="thumbsUp-icon"/></button></td>
              </tr>
              ))}
              </tbody>
            ))}
          </table>
          :null}
        </div>
        <div className="admin-select-employee container">
          <div className="white-header">
            <h3>Select Employee</h3>
          </div>
          <select value={this.state.employeeSelected.name} onChange={(e)=>this.handleChange(e.target.value)}>
              <option value={"Select Employee"} default>Select Employee</option>
            {this.props.people.map((person, i)=>(
              <option key={i} value={i}>{person.name}</option>
            ))}
          </select>
          {this.state.employeeSelected.name?
          <div className="employee">
            <h3 className="employee-name">{this.state.employeeSelected.name}</h3>
            <h3 className="start-date">
              Start Date:
              {this.state.employeeSelected.beginDate?
              <span> {new Date(this.state.employeeSelected.beginDate).toLocaleDateString("en-US", {timeZone:'UTC'})}</span>
              :null}
            </h3>
          </div>
          :null}
        </div>
        {this.state.employeeSelected.name ?
        <div>

        <div className="admin-vacation-hours-per-year container">
          <div className="white-header">
            <h3>PTO days per year</h3>
          </div>
          <h4 className="vacation-hours-per-year">{this.state.employeeSelected.vacationHoursPerYear/8}</h4>
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
            <h3>Add/Subtract</h3>
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
                {this.state.employeeSelected.oneOffAdditions.map((entries, i) =>(
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
        </div>
        :null}
      </div>

  )
  }
}

export default Admin;
