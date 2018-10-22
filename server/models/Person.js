const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: String,
    vacationHoursRemaining: Number,
    additionalHoursPerCycle: Number,
    entries:[{
      startDate: Date,
      endDate: Date,
      hoursUsed: Number
    }]
});

module.exports = mongoose.model('Person', PersonSchema);
