const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const vacationSchema = new mongoose.Schema({
    weekNum: { type: Number, unique: true },
    startDate: { type: Date },
    // startDateOffset: { type: Number },
    endDate: { type: Date },
    // endDateOffset: { type: Number },
    slotA: { type: String, lowercase: true },
    slotB: { type: String, lowercase: true },
    slotC: { type: String, lowercase: true },
    slotD: { type: String, lowercase: true },
    slotE: { type: String, lowercase: true },
    slotF: { type: String, lowercase: true },
    slotG: { type: String, lowercase: true },
    slotH: { type: String, lowercase: true },
    notes: { type: String, lowercase: true },
}, {
    timestamps: true,
});

// const vacationSchema = new mongoose.Schema({
//     weekNum: { type: Number, unique: true },
//     startDate: { type: Date },
//     endDate: { type: Date },
//     slotA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotC: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotD: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotE: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotF: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotG: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     slotH: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     notes: { type: String }
// });

vacationSchema.set('validateBeforeSave', false);
module.exports = mongoose.model('Vacation', vacationSchema);