const UpdateHours = require('../../models/UpdateHour');

module.exports = (app) => {
  app.get('/api/updateHours', (req, res, next) =>{
    UpdateHours.find({})
    .exec()
    .then((updateHours)=>{
      console.log("UpdateHours", updateHours);
      res.json(updateHours);
    })
  })

  function addMonthlyAccrual(){
    let today = new Date();
    var month = today.getMonth();
    var dayOfMonth = today.getDate();
    console.log("HHHHHIIII", dayOfMonth, month);
    if (dayOfMonth === 1 ) {

    }

  }

  addMonthlyAccrual();

}
