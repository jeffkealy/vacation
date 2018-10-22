import React, { Component } from 'react';
import 'whatwg-fetch';
import Calendar from 'react-calendar';
import Entries from '../Details/Entries'


class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person:{},
      startDate: new Date,
      endDate: new Date(),
      startDateClicked: false,
      endDateClicked: false,
      hoursToBeUsed: 0
    };
    this.addVacationDates = this.addVacationDates.bind(this);
    this.dateSet = this.dateSet.bind(this);
    this.calculateHours = this.calculateHours.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);

  }

  componentWillMount(){

  }

  componentDidMount() {

    let id = this.props.person
    console.log("NAME", id);
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
    console.log("addVacationDates", this.state.startDate, this.state.endDate);
    let beginningOfDayStartDate = this.state.startDate.setHours(0,0,0,0)
    let beginningOfDayEndDate = this.state.endDate.setHours(0,0,0,0)
    beginningOfDayStartDate = new Date(beginningOfDayStartDate)
    beginningOfDayEndDate = new Date(beginningOfDayEndDate)
    this.setState({
      startDate: beginningOfDayStartDate,
      endDate: beginningOfDayEndDate,
    });
    const id = this.state.person._id;
    const data = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      hoursUsed: this.state.hoursToBeUsed
    }
    console.log("Entry to send for", this.props.person.name, data);
    console.log(JSON.stringify(data));
    fetch(`/api/people/${id}/entry`,
      { method: 'PUT',
        headers: {'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
          this.setState({
            person: json
          })
      });
  }
  deleteEntry(entries, i){

    const entryID = this.state.person.entries[i]._id;
    const id = this.state.person._id
    console.log("delete this",id, entryID);
    fetch(`/api/people/${id}/delete/${entryID}`,
      {
        method:'DELETE'
      })
    .then(res => res.json())
    .then(json => {
      this.setState({
        person: json
      })
        console.log(json);
    });
  }
  render() {
    console.log("RENDER");
    return (
      <>
          <div className="details">
            <h1>{this.state.person.name}</h1>
            <div className="hours-remaining">
              <h3>Vacation Hours Remaining </h3>
              <h2>  {this.state.person.vacationHoursRemaining}</h2>
            </div>
            <div className="view-entry">
              <h3 className="view-entry-table-title">Previous Entries:</h3>
                {this.state.person.entries ?
                  <table className="view-entry-table">
                    <tbody>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Hours used</th>
                      </tr>
                      {this.state.person.entries.map((entries, i) =>(
                        <tr key={i}>
                          <td className="start-date">{new Date(entries.startDate).toLocaleDateString("en-US")}</td>
                          <td className="endDate-date">{new Date(entries.endDate).toLocaleDateString("en-US")}</td>
                          <td className="hours-used">{entries.hoursUsed}</td>
                          <td><button onClick={()=>this.deleteEntry(entries, i)} className="delete-button">X</button></td>
                        </tr>
                      ))}
                  </tbody>
                </table> : null
                }
            </div>
            <div className="add-entry">
              <div className="add-entry calendar">
                <h3 className="add-entry-title">Add Entry:</h3>
                <Calendar
                  value={this.state.startDate}
                  onChange={d => this.dateSet(d)}
                  selectRange={true}
                />
              </div>

              <div className="add-entry-preview">
                <span>{this.state.startDate.toLocaleDateString("en-US")} </span>
                to
                <span> {this.state.endDate.toLocaleDateString("en-US")}</span>
                <br/>
                hours used for this entry
                <span> {this.state.hoursToBeUsed}</span>
              </div>
              <button onClick={this.addVacationDates}className="add-entry-button" >Add</button>
            </div>
          </div>

      </>
    );
  }
}


export default Details;
