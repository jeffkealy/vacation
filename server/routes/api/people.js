const Person = require('../../models/Person');

module.exports = (app) => {
  app.get('/api/person/names', (req, res, next) =>{
    Person.find({},{name: 1})
    .exec()
    .then((names)=>{
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

  app.put('/api/people/:id/entry', (req, res, next) => {
    console.log("put", req.params.id, req.body);
    Person.findOneAndUpdate({ _id: req.params.id},{$push: {entries:req.body}},{new:true})
      .exec()
      .then((person) => {
        console.log(person);
        res.json(person)

      })
      .catch((err) => {console.log("ERROR");next(err)});
  });
  app.delete('/api/people/:id/delete/:entryID', (req,res,next)=>{
    console.log("REQBODY",req.params.id,req.params.entryID);
    Person.findOneAndUpdate({_id: req.params.id}, {$pull:{entries: {_id:req.params.entryID}}},{new:true})
    .exec()
    .then((entry)=>{
      console.log("DELETED", entry);
      res.json(entry)
    })
    .catch((err)=> next(err));
  })
}
