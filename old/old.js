calculateHoursRemaining(person){
  let vactaionHoursPerDay = (person.vacationHoursPerYear)/365
  let beginDate = new Date(person.beginDate).getTime();
  let today = new Date().getTime();
  let one_day=1000*60*60*24;
  let timeHereIn_ms = (today-beginDate)
  let daysHere = timeHereIn_ms/1000/60/60/24
  console.log("daysHere", daysHere);
  let totalNumberOfVacationDays = Math.round((daysHere * vactaionHoursPerDay)*100)/100
  let hoursUsedArrayLoop = [];
  let entriesArray = person;
  console.log("totalNumberOfVacationDays", totalNumberOfVacationDays/8);
  let vacationHoursUsed = person.vacationHoursRemaining
  if(person.entries){
    for (let i = 0; i < person.entries.length; i++) {
      vacationHoursUsed = vacationHoursUsed - person.entries[i].hoursUsed
    }
    console.log("vacation days, hours used", vacationHoursUsed, person.vacationHoursRemaining);
    return (totalNumberOfVacationDays/8)
  } else return
}

calculateMonthlyDaysAccrued(person){
  let beginDateMonth = new Date(person.beginDate).getMonth()+1;
  let beginDateYear = new Date(person.beginDate).getFullYear();
  let todayMonth = new Date().getMonth()+1;
  let todayYear = new Date().getFullYear();
  console.log("calculateMonthlyDaysAccrued", beginDateMonth, todayMonth);
  let vactaionHoursPerMonth = (person.vacationHoursPerYear)/12
  let monthsHere = (todayMonth-beginDateMonth) +((todayYear-beginDateYear)*12);
  // this.calculateYearEndDaysAccrued(monthsHere)
  let yearEndDaysAccrued = (13-beginDateMonth) +((todayYear-beginDateYear)*12)
  console.log("Year End Months", yearEndDaysAccrued);

  return {monthlyDaysAccrued:Math.round((monthsHere*vactaionHoursPerMonth/8)*1000)/1000,
          yearEndDaysAccrued:Math.round((yearEndDaysAccrued*vactaionHoursPerMonth/8)*1000)/1000
  }
}

yearEndDaysAccrued:(Math.ceil((hoursAccruedPerDay*(hoursHere+hoursLeftInTheYear)/24)*2)/2)+oneOffAdditionDays,
let daysRemainingEOY = ((Math.ceil((hoursAccruedPerDay*(hoursWorkedThisYear)/24)*2)/2)+oneOffAdditionDays)-(hoursUsed.total/8);
if (daysRemainingEOY > (person.vacationHoursPerYear/8)+5) {
  daysRemainingEOY=(person.vacationHoursPerYear/8)+5;
}
