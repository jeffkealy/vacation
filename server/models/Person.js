const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    vacationHoursRemaining: Number,
    vacationHoursPerYear: Number,
    beginDate:Date,
    oneOffAdditions:[{
      oneOffHours:Number,
      note: String,
      date: Date
    }],
    entries:[{
      startDate: Date,
      endDate: Date,
      hoursUsed: Number,
      note: String,
      subtractHalfDayHours: Number,
      approved: Boolean
    }]
});

module.exports = mongoose.model('Person', PersonSchema);
