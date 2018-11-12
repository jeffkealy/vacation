import React, { Component } from 'react';
import 'whatwg-fetch';
import Details from '../Details/Details';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      showDetails: false,
      monthlyAccrualAdded: false,
      updateHours: []
    };
    this.getDetails = this.getDetails.bind(this);
    this.addMonthlyAccrual = this.addMonthlyAccrual.bind(this);

  }

  componentDidMount() {
    fetch(`/api/updateHours`)
    .then(res => res.json())
    .then(json=>{
      console.log("GET TIME", json);
      this.setState({
        people:json
      });
      fetch(`/api/person/names`)
      .then(res => res.json())
      .then(json =>{
        console.log("GET People", json);
        this.setState({
          people:json
        });
        this.addMonthlyAccrual();

      })
    });
  }

  getDetails(person){
    console.log("person details", person);
    this.setState({
      showDetails: !this.state.showDetails,
      person: person
    })


  }
  addMonthlyAccrual(){
    let today = new Date();
    let dayOfMonth = today.getDate();
    console.log("addMonthlyAccrual", dayOfMonth);

    if (dayOfMonth === 7 ) {
      console.log("first of the month");
    }
  }
  // newCounter() {
  //   fetch('/api/people', { method: 'POST' })
  //     .then(res => res.json())
  //     .then(json => {
  //       let data = this.state.counters;
  //       console.log("POST", data);
  //       data.push(json);
  //
  //       this.setState({
  //         counters: data
  //       });
  //     });
  // }
  //
  // incrementCounter(index) {
  //   const id = this.state.counters[index]._id;
  //
  //   fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
  //     .then(res => res.json())
  //     .then(json => {
  //       this._modifyCounter(index, json);
  //     });
  // }
  //
  // decrementCounter(index) {
  //   const id = this.state.counters[index]._id;
  //
  //   fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
  //     .then(res => res.json())
  //     .then(json => {
  //       this._modifyCounter(index, json);
  //     });
  // }
  //
  // deleteCounter(index) {
  //   const id = this.state.counters[index]._id;
  //
  //   fetch(`/api/counters/${id}`, { method: 'DELETE' })
  //     .then(_ => {
  //       this._modifyCounter(index, null);
  //     });
  // }
  //
  // _modifyCounter(index, data) {
  //   let prevData = this.state.counters;
  //
  //   if (data) {
  //     prevData[index] = data;
  //   } else {
  //     prevData.splice(index, 1);
  //   }
  //
  //   this.setState({
  //     counters: prevData
  //   });
  // }

  render() {
    return (
      <>
        <p className= {this.state.showDetails ? 'hidden' :''}>People</p>


        <ul className="people">
          { this.state.people.map((people, i) => (
              <li key={i} className= {this.state.showDetails ? 'hidden' :''}>
                <button onClick={() => this.getDetails(people)} className="people-button">{this.state.people[i].name}</button>
              </li>
            ))}
          { this.state.showDetails ?
              <div className="details-container">
                <button className="back-button" onClick={() => this.setState({showDetails: false})}>Back</button>
                <Details person={this.state.person} people={this.state.people}/>
              </div>
              : null
          }
        </ul>

      </>
    );
  }
}

// <li key={i}>
//   <button onClick={() => this.incrementCounter(i)}></button>
//   <button onClick={() => this.deleteCounter(i)}>x</button>
// </li>

// <button onClick={this.newCounter}>New counter</button>

export default Home;
