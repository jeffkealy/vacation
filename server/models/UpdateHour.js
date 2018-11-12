const mongoose = require('mongoose');

const UpdateHourSchema = new mongoose.Schema({
    thisMonthsHoursAdded: Boolean,
    lastLoginDate: Date,
    logs:[{
      note: String
    }]
});

module.exports = mongoose.model('UpdateHour', UpdateHourSchema);
