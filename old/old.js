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


,
{
test: /\.(png|svg|jpg|gif)$/,
 use: [
   'file-loader'
 ]
}


mongoimport -d <databasename> -c <collectionname> --type csv --file <filelocation/file.csv> --host <hostdir example:ds011291.mlab.com> --port <portnumber example:11111> -u <username> -p <password> --headerline

mongorestore -h ds027348.mlab.com:27348 -d heroku_gbp2sgfl -u jeffkealy -p typepassowrdhere /Users/queueit/Documents/dev/Vacation/dump/vacation

mongodump -d vacation

{
  db: 'mongodb://localhost:27017/vacation',
  db_dev: 'mongodb://localhost:27017/vacation'

}


calculateHours(date){
  console.log("calculate hours", date);
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
