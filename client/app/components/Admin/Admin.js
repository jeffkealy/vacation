import React, { Component } from 'react';
import 'whatwg-fetch';
import {firebaseAuth} from "../Firebase/firebase";

import AllUsers from '../AllUsers/AllUsers';
import Logout from "../Logout/Logout"
import Details from '../Details/Details';
import {TiThumbsUp} from 'react-icons/ti';


const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";


class Admin extends Component{
  constructor(props) {
    super(props);

    this.state={
      logInApproved: false,
      people: [],
      showDetails: false,
      showPeople: true,
      key:0,
      key:0
    };
    this.approveEntry = this.approveEntry.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.refreshApproval = this.refreshApproval.bind(this);
  }
componentDidMount(){
  firebaseAuth().onAuthStateChanged(user => {
      if (user) {

          localStorage.removeItem(firebaseAuthKey);
          // store the token
          localStorage.setItem(appTokenKey, user.uid);
          //store email
          localStorage.setItem("userEmail", user.email)
          console.log("user.email", user.email);
          this.setState({
            userEmail:user.email,
            logInApproved: true
          })
        fetch(`/api/user/${user.email}`, {method: 'PUT'})
          .then(res => res.json())
          .then(json => {
            if (!json) {
              this.setState({noUser:true})
            } else if (json.admin) {
              json.entries.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
              this.setState({
                person: json
              });
              console.log("#####",this.state.person);

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
           });
            } else {
              this.props.history.push('/')
            }
  });

}

approveEntry(entry){
  let id = entry._id
  console.log("approveEntry entry", entry);
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
        this.setState({
          people:json,
          key: this.state.key+1
        });
      })
    });
}

getDetails(person){
  console.log("person details", person);
  this.setState({
    showDetails: true,
    showPeople: false,
    person: person
  })
}

refreshApproval(){
  console.log("refreshApproval");
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
    this.setState({
      people:json
    });
  })
}
render(){
  return(
    <>
      {this.state.logInApproved?
        <div className="admin-container main-container ">
        <h1 className="admin-title">Admin</h1>
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
        <div className="all-users-container container">
          <div className={this.state.showPeople ? 'people-title white-header' :'hidden'}><h2>People</h2></div>
          <ul className={this.state.showPeople ? 'people-list' :'hidden' }>
            {[].concat(this.state.people).sort((a,b)=>a.peopleM > b.peopleM).map((people, i) => (
                <li key={i} className='people'>
                  <button onClick={() => this.getDetails(people)} className="home-button action-button">{this.state.people[i].name}</button>
                </li>
              ))}

          </ul>
          {this.state.showDetails ?
            <div className="userHome-container">
              <button className="back-button action-button" onClick={() => this.setState({showDetails: false, showPeople:true})}>Back</button>
              <Details
                person={this.state.person}
                people={this.state.people}
                email={this.state.person.email}
                key={this.state.key}
                refreshApproval={this.refreshApproval}
                />
            </div>
            : null
          }
        </div>
        <div className="logout-container">
          <Logout history={this.props.history}/>
        </div>
      </div>
      :<div>Sign In Needed</div>}
    </>
  )
  }
}

export default Admin;


// <AllUsers key={this.state.key}/>
