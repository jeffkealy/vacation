const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    vacationHoursRemaining: Number,
    vacationHoursPerYear: Number,
    beginDate:Date,
    oneOffAdditions:[{
      add:Number,
      note: String,
      date: Date
    }],
    entries:[{
      startDate: Date,
      endDate: Date,
      hoursUsed: Number,
      note: String,
      subtractHalfDayHours: Number
    }]
});

module.exports = mongoose.model('Person', PersonSchema);
