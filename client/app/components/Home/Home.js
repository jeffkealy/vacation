import React, { Component } from 'react';
import 'whatwg-fetch';
import Details from '../Details/Details';
import Admin from '../Admin/Admin';
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      showDetails: false,
      showPeople: true,
      showAdmin: false,
      monthlyAccrualAdded: false,
      updateHours: []
    };
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    fetch(`/api/person/names`)
    .then(res => res.json())
    .then(json =>{
      console.log("GET People", json);
      this.setState({
        people:json
      });
    })
  }

  getDetails(person){
    console.log("person details", person);
    this.setState({
      showDetails: true,
      showPeople: false,
      showAdmin: false,
      person: person
    })
  }


  render() {
    return (
      <>
      <div className="home-container">

        <p className= {this.state.showPeople ? 'people-title' :'hidden'}>People</p>
        <ul className={this.state.showPeople ? 'people-list' :'hidden' }>
          { this.state.people.map((people, i) => (
              <li key={i} className='people'>
                <button onClick={() => this.getDetails(people)} className="home-button">{this.state.people[i].name}</button>
              </li>
            ))}

        </ul>
        { this.state.showDetails ?
            <div className="details-container">
              <button className="back-button action-button" onClick={() => this.setState({showDetails: false, showPeople:true, showAdmin:false})}>Back</button>
              <Details person={this.state.person} people={this.state.people}/>
            </div>
            : null
        }
        { this.state.showPeople ?
          <button onClick={()=> this.setState({showAdmin:true, showPeople:false})} className="home-button admin-button">Admin</button>
          :null
        }
        {this.state.showAdmin ?
          <div>

            <button className="back-button action-button admin" onClick={() => this.setState({showAdmin: false, showPeople:true})}>Back</button>
            <h2 className="admin-title">Admin</h2>
            <Admin people={this.state.people}/>
          </div>
          :null
        }
      </div>

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
