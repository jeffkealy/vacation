import React, { Component } from 'react';
import 'whatwg-fetch';
import Details from '../Details/Details';
import Admin from '../Admin/Admin';

class AllUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      showDetails: false,
      showPeople: true,
    };
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    fetch(`/api/person/names`)
    .then(res => res.json())
    .then(json =>{
      json.sort((a,b) => {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });
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
      person: person
    })
  }


  render() {
    return (
      <>
      <div className="all-users-container container">
        <div className={this.state.showPeople ? 'people-title white-header' :'hidden'}><h2>People</h2></div>
        <ul className={this.state.showPeople ? 'people-list' :'hidden' }>
          {[].concat(this.state.people).sort((a,b)=>a.peopleM > b.peopleM).map((people, i) => (
              <li key={i} className='people'>
                <button onClick={() => this.getDetails(people)} className="home-button action-button">{this.state.people[i].name}</button>
              </li>
            ))}

        </ul>
        { this.state.showDetails ?
            <div className="userHome-container">
              <button className="back-button action-button" onClick={() => this.setState({showDetails: false, showPeople:true})}>Back</button>
              <Details person={this.state.person} people={this.state.people} email={this.state.person.email}/>
            </div>
            : null
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

export default AllUsers;
