import React, { Component } from 'react';
import 'whatwg-fetch';
import {TiThumbsUp} from 'react-icons/ti';
import AllUsers from '../AllUsers/AllUsers';
import Logout from "../Logout/Logout"
import {firebaseAuth} from "../Firebase/firebase";

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";



class Admin extends Component{
  constructor(props) {
    super(props);

    this.state={
      employeeSelected:{},
      logInApproved: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.approveEntry = this.approveEntry.bind(this);


  }
componentDidMount(){
  firebaseAuth().onAuthStateChanged(user => {
      if (user) {

          localStorage.removeItem(firebaseAuthKey);
          // store the token
          localStorage.setItem(appTokenKey, user.uid);
          //store email
          localStorage.setItem("userEmail", user.email)

          this.setState({
            userEmail:user.email,
            logInApproved: true
          })


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
      } else {
        this.props.history.push('/')
      }
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
    <>
      {this.state.logInApproved?
        <div className="admin-container ">
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
        <AllUsers/>
        <div>
          <Logout history={this.props.history}/>
        </div>
      </div>
      :<div>Sign In Needed</div>}
    </>
  )
  }
}

export default Admin;
