import React, { Component } from 'react';

class Entries extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    const entries = this.props.entries;
    console.log(entries);
    return(
      <table>
        <tbody>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Hours used</th>
          </tr>
        {entries.map((entries, i) =>(
          <tr key={i}>
            <td>{new Date(entries.startDate).toLocaleDateString("en-US")}</td>
            <td>{new Date(entries.endDate).toLocaleDateString("en-US")}</td>
            <td>{entries.hoursUsed}</td>
          </tr>
        ))}
        </tbody>
      </table>

    )
  }
}

export default Entries;
