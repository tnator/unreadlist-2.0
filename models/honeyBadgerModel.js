const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const honeyBadgerSchema = new mongoose.Schema({
    startTime: { type: Date },
    endTime: { type: Date },
    shiftDuration: { type: Number },
    payer: { type: String },
    rate: { type: Number },
    fee: { type: Number },
    assigned: { type: String }
}, {
    timestamps: true
});



// Insert pre javascript function to calculate date and save it in UTC and display formats
// Same for times to nonmilitary
module.exports = mongoose.model('HoneyBadger', honeyBadgerSchema);