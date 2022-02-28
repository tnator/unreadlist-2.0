const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const vacationSchema = new mongoose.Schema({
    weekNum: { type: Number, unique: true },
    startDate: { type: Date },
    endDate: { type: Date },
    slotA: { type: String},
    slotB: { type: String},
    slotC: { type: String},
    slotD: { type: String},
    slotE: { type: String},
    slotF: { type: String},
    notes: { type: String}
});
module.exports = mongoose.model('Vacation', vacationSchema);