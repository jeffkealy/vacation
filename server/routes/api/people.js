const Person = require('../../models/Person');

module.exports = (app) => {
  app.get('/api/person/names', (req, res, next) =>{
    Person.find({}
      // {name: 1}
    )
    .exec()
    .then((names)=>{
      console.log(names);
      res.json(names);
    })
  })
  app.put('/api/person/:id', (req, res, next) => {
    console.log(req.params.id);
    Person.findOne({name:req.params.id})
      .exec()
      .then(
        (people) => {
          res.json(people);
          console.log("AAAAAAA", people)
        }

      )
      .catch((err) => next(err));
  });
//add entry
  app.put('/api/people/:id/entry', (req, res, next) => {
    console.log("PUT", req.params.id, req.body);
    Person.findOneAndUpdate({ _id: req.params.id},{$set:{vacationHoursRemaining:req.body.vacationHoursRemaining},$push: {entries:req.body.entry}},{new:true})
      .exec()
      .then((person) => {
        console.log("PUT RES",person);
        res.json(person)

      })
      .catch((err) => {console.log("ERROR");next(err)});
  });
  app.put('/api/people/:id/hoursPerCycle/:hours', (req, res, next) => {
    console.log("hoursPerCycle", req.params.id, req.params.hours);
    var hours = req.params.hours*8
    Person.findOneAndUpdate({ _id: req.params.id},{vacationHoursPerYear:hours} ,{new:true})
      .exec()
      .then((person) => {
        console.log(person);
        res.json(person)

      })
      .catch((err) => {console.log("ERROR");next(err)});
  });
//delete entry
  app.delete('/api/people/:id/delete', (req,res,next)=>{
    console.log("REQBODY",req.params.id,req.body.entryID);
    Person.findOneAndUpdate({_id: req.params.id}, {$set:{vacationHoursRemaining:req.body.vacationHoursRemaining},$pull:{entries: {_id:req.body.entryID}}},{new:true})
    .exec()
    .then((entry)=>{
      console.log("DELETED", entry);
      res.json(entry)
    })
    .catch((err)=> next(err));
  })
}
