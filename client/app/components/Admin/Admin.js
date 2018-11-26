import React, { Component } from 'react';
import 'whatwg-fetch';


class Admin extends Component{
  constructor(props) {
    super(props);

    this.state={
      employeeSelected:{},
      updateVacationHoursPerYear: "",
      oneOffHours: 0,
      OneOffNote:""
    };
    this.updateVacationDaysPerYear = this.updateVacationDaysPerYear.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteOneOffEntry = this.deleteOneOffEntry.bind(this);
    this.addOneOffEntry = this.addOneOffEntry.bind(this);



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
  let id = this.employeeSelected._id
  console.log("addOneOffEntry", id);
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
          note: ""
        })
        this.hoursCalculations(json)
    });
}
deleteOneOffEntry(entries, i){
  console.log(entries, i, this.state.employeeSelected);
  fetch(`/api/people/${id}/deleteOneOff`,
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
handleChange(e){
  this.setState({
    employeeSelected: this.props.people[e]
  })
}

render(){
  return(
      <div className="admin-container ">
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
                className='oneOff-days-input'
                type="number"

                />
            </label>
            <label> Note
              <input
                className='oneOff-note-input'
                type="text"

                />
            </label>
              <button className='submit-button action-button'>Submit</button>

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
