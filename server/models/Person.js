const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: String,
    vacationHoursRemaining: Number,
    vacationHoursPerYear: Number,
    beginDate:Date,
    oneOffAdditions:[{
      add:Number,
      note: String
    }],
    entries:[{
      startDate: Date,
      endDate: Date,
      hoursUsed: Number,
      note: String
    }]
});

module.exports = mongoose.model('Person', PersonSchema);
