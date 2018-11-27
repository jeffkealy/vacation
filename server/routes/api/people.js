const Person = require('../../models/Person');

module.exports = (app) => {
//get all data
  app.get('/api/person/names', (req, res, next) =>{
    Person.find({}
    )
    .exec()
    .then((names)=>{
      console.log(names);
      res.json(names);
    })
  })
//get person by id
  app.put('/api/person/:id', (req, res, next) => {
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
    Person.findOneAndUpdate({ _id: req.params.id},{$set:{vacationHoursRemaining:req.body.vacationHoursRemaining},$push: {entries:req.body.entry}},{new:true})
      .exec()
      .then((person) => {
        console.log("PUT RES",person);
        res.json(person)

      })
      .catch((err) => {console.log("ERROR");next(err)});
  });
//delete entry
  app.delete('/api/people/:id/delete', (req,res,next)=>{
    Person.findOneAndUpdate({_id: req.params.id}, {$set:{vacationHoursRemaining:req.body.vacationHoursRemaining},$pull:{entries: {_id:req.body.entryID}}},{new:true})
    .exec()
    .then((entry)=>{
      console.log("DELETED", entry);
      res.json(entry)
    })
    .catch((err)=> next(err));
  })
//add oneOff
  app.put('/api/people/:id/addOneOff', (req, res, next) => {
    Person.findOneAndUpdate({ _id: req.params.id}, {$push: {oneOffAdditions:req.body}},{new:true})
      .exec()
      .then((person) => {
        console.log("PUT RES",person);
        res.json(person)

      })
      .catch((err) => {console.log("ERROR");next(err)});
  });
//delete oneOff
  app.delete('/api/people/:id/deleteOneOff', (req,res,next)=>{
    console.log("REQBODY",req.params.id,req.body.entryID);
    Person.findOneAndUpdate({_id: req.params.id}, {$pull:{oneOffAdditions: {_id:req.body._id}}},{new:true})
    .exec()
    .then((entry)=>{
      console.log("DELETED", entry);
      res.json(entry)
    })
    .catch((err)=> next(err));
  })
//approve vacation
app.put('/api/approve/:id', (req, res, next) => {
  Person.findOneAndUpdate({entries:{$elemMatch:{_id:req.params.id}}},{$set:{"entries.$.approved": true}},{new:true})
    .exec()
    .then((person) => {
      console.log("PUT RES",person);
      res.json(person)

    })
    .catch((err) => {console.log("ERROR");next(err)});
});

}
