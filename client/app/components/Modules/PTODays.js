import React, { Component } from 'react';

class PTODays extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
    this.calculateHoursUsed = this.calculateHoursUsed.bind(this);
    this.hoursCalculations = this.hoursCalculations.bind(this);
    this.calculateOneOffAdditions = this.calculateOneOffAdditions.bind(this);
    this.timezoneOffsetHours = this.timezoneOffsetHours.bind(this);
    this.calculateHalfDays = this.calculateHalfDays.bind(this);

  }
  componentDidMount() {
    let person = this.props.person;
    console.log("PTODAYS props componentDidMount", person);
    this.setState({
      person: this.props.person
    },()=>this.hoursCalculations(this.state.person));
    console.log("PTODAYS componentDidMount", this.state.person);
  }

  calculateHoursUsed(person){
  if(person.entries){
    let hoursUsed = {
      total: 0,
      thisYear: 0,
      lastYear:0
    }
    let totalHalfDays = 0;
    let thisYearHalfDays = 0;
    let lastYearHalfDays = 0;

    let currentYear = new Date()
      for (let i = 0; i < person.entries.length; i++) {
        let startDateYear = new Date(person.entries[i].startDate).getFullYear()
        let endDateYear = new Date(person.entries[i].endDate).getFullYear()

        hoursUsed.total = hoursUsed.total + person.entries[i].hoursUsed
        totalHalfDays = totalHalfDays + person.entries[i].subtractHalfDayHours
        if (startDateYear === new Date().getFullYear()
            && endDateYear === new Date().getFullYear()
            && startDateYear === endDateYear) {
            hoursUsed.thisYear = hoursUsed.thisYear + person.entries[i].hoursUsed
            thisYearHalfDays = thisYearHalfDays + person.entries[i].subtractHalfDayHours
        } else if(startDateYear === new Date().getFullYear()-1
                  && endDateYear === new Date().getFullYear()-1) {
                  lastYearHalfDays = lastYearHalfDays + person.entries[i].subtractHalfDayHours
                  hoursUsed.lastYear = hoursUsed.lastYear + person.entries[i].hoursUsed


        } else{

        }
      }
      hoursUsed.total = hoursUsed.total + totalHalfDays;
      hoursUsed.thisYear = hoursUsed.thisYear + thisYearHalfDays;
      hoursUsed.lastYear = hoursUsed.lastYear + lastYearHalfDays;
      // console.log("half lastYearDays", lastYearHalfDays);
      // console.log("half thisYearDays", thisYearHalfDays);
      // console.log("half totalDays", totalHalfDays);
     return (hoursUsed)
   } else return "Could not calculate hours"
  }

  hoursCalculations(person){
    if(person.name){
      console.log("hoursCalculations");
      let today = new Date().setHours(0,0,0,0);
      today = new Date(today)
      let beginDate = new Date(person.beginDate).setHours(0,0,0,0);
      beginDate = new Date(beginDate)
      let endOfYear = new Date((today.getFullYear()),11,31).setHours(23,59,59,999);
      let startOfYear = new Date(today.getFullYear(),0,1);
      let currentYear = new Date(today).getFullYear();
      let hoursAccruedPerDay = (person.vacationHoursPerYear/8)/365;
      let hoursUsed = this.calculateHoursUsed(person);  //Vacation hours used
      let oneOffAdditionDays = this.calculateOneOffAdditions(person)/8 //one off additions hours converted to days
      let hoursHere = ((today - beginDate)/1000/60/60)+(this.timezoneOffsetHours(beginDate,today)); //hours person has been with company as of start date
      let hoursAccruedSinceStart = hoursAccruedPerDay*hoursHere;
      let hoursLeftInTheYear = (endOfYear - today.getTime()+this.timezoneOffsetHours(today.getTime(),endOfYear))/1000/60/60;
      let hoursThisYear = (today - startOfYear +this.timezoneOffsetHours(startOfYear.getTime(), today.getTime()))/1000/60/60;
      let hoursWorkedLastYear
      let hoursWorkedThisYear = hoursThisYear
      if (beginDate.getFullYear() === currentYear-1) {
          hoursWorkedLastYear = ((new Date(currentYear-1,11,31).setHours(23,59,59,999))-beginDate)/1000/60/60+this.timezoneOffsetHours(new Date(currentYear-1,11,31).setHours(23,59,59,999),beginDate);
          hoursWorkedLastYear = Math.round(hoursWorkedLastYear)
          console.log("###In 2nd year hoursWorkedLastYear",hoursWorkedLastYear);
      } else if(beginDate.getFullYear() === currentYear){
        hoursWorkedThisYear = ((today-beginDate)/1000/60/60)+this.timezoneOffsetHours(endOfYear,beginDate);
        hoursWorkedLastYear = 0;
        // console.log("In 1st year. Worked",today, beginDate,(today-beginDate)/1000/60/60);
      } else {
        console.log("in 3rd year", new Date(currentYear), beginDate.getFullYear());
        hoursWorkedLastYear = 8760
      }

      let daysAccruedSinceStart = (Math.ceil((hoursAccruedSinceStart/24)*2)/2)+oneOffAdditionDays;
      let daysAccruedlastYear = (Math.ceil(((hoursWorkedLastYear/24)*hoursAccruedPerDay)-hoursUsed.lastYear/8)*2)/2
      if (daysAccruedlastYear > 5) {daysAccruedlastYear=5}
      if (daysAccruedlastYear < 0) {daysAccruedlastYear=0}
      let daysRemainingEOY = (person.vacationHoursPerYear/8)+oneOffAdditionDays+daysAccruedlastYear
      let useByEndOfYear = (Math.ceil((hoursAccruedPerDay*(hoursHere+hoursLeftInTheYear)/24)*2)/2)+oneOffAdditionDays-(hoursUsed.total/8)-5
      if (useByEndOfYear < 0) {useByEndOfYear =0 }
      console.log("hoursUsed.thisYear", hoursUsed.thisYear);
      this.setState({
        hoursUsedThisYear: hoursUsed.thisYear,
        daysRemaining:(Math.ceil((hoursAccruedPerDay*(hoursHere/24)*2)/2-(hoursUsed.total/8))+oneOffAdditionDays),
        daysRemainingEOY: daysRemainingEOY-hoursUsed.thisYear/8,
        daysLeftFromLastYear: daysAccruedlastYear,
        daysAccruedThisYear: (Math.ceil((hoursAccruedPerDay)*hoursWorkedThisYear/24)*2)/2,
        yearEndDaysAccrued:(person.vacationHoursPerYear/8)+oneOffAdditionDays+daysAccruedlastYear,
        useByEndOfYear: useByEndOfYear
      })
    } else return


  }

  calculateOneOffAdditions(person){
    if(person.oneOffAdditions){
      let oneOffAdditionHours = 0
      for (var i = 0; i < person.oneOffAdditions.length; i++) {
        oneOffAdditionHours = oneOffAdditionHours + person.oneOffAdditions[i].oneOffHours
      }
      return oneOffAdditionHours
    }
    else return null
  }

  calculateHalfDays(person){

    let halfDayHours = 0
    for (var i = 0; i < person.entries.length; i++) {
      halfDayHours = halfDayHours + person.entries[i].subtractHalfDayHours
    }
    return halfDayHours
  }

  timezoneOffsetHours(earlier, later){
    let earlierOffset = new Date(earlier).getTimezoneOffset()
    let laterOffset= new Date(later).getTimezoneOffset()
    let timezoneDifference = earlierOffset - laterOffset;
    return timezoneDifference/60
  }



render(){
  return(
    <>
    {this.state.person?
    <div className="vacation-days-details container">
      <div className="white-header">
        <h2 className="vacation-days-details-header "> PTO Days</h2>
      </div>
      <h2 className="black-header">This Year</h2>
      <div className="detail-group top content">
        <div className="detail-container used">
          <h4>Used </h4>
            <h3> {this.state.hoursUsedThisYear/8}</h3>
        </div>
        <div className="detail-container remaining">
          <h4>Remaining </h4>
          <h3>{this.state.daysRemainingEOY}</h3>
        </div>
      </div>
      <div className="detail-group accrued">
        <h2 className="black-header">Accrued</h2>
        <div className="content">
          <div className="detail-containr-top">
            <div className="detail-container total-accrued">
              <h4> This year </h4>
              <h3> {this.state.daysAccruedThisYear}</h3>
            </div>
            <div className="detail-container total-accrued">
              <h4>From {new Date().getFullYear() - 1}</h4>
              <h3> {this.state.daysLeftFromLastYear}</h3>
            </div>
            <div className="detail-container total-accrued">
              <h4>By End Of Year</h4>
              <h3> {this.state.yearEndDaysAccrued}</h3>
            </div>
          </div>
          <div className="detail-container accrued monthly">
            <h4>Monthly </h4>
            <h3>  {Math.round((this.state.person.vacationHoursPerYear/8/12) * 1000) / 1000}</h3>
          </div>
          <div className="detail-container accrued annually">
            <h4>Annually </h4>
            <h3>  {this.state.person.vacationHoursPerYear/8}</h3>
          </div>
        </div>
        <div className="detail-container remaining">
          <h5>5 hours of PTO can be rolled over to the next year <br></br> so you'll need to use</h5>
          <h3>{this.state.useByEndOfYear} days</h3>
          <h5>by the end of the year</h5>
        </div>
      </div>

    </div>
    :<div>Couldn't get Data</div>}
    </>
  );
 }
}
export default PTODays
