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

// const vacationSchema = new mongoose.Schema({
//     weekNum: { type: Number, unique: true },
//     startDate: { type: Date },
//     endDate: { type: Date },
//     slotA: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     slotB: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     slotC: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     slotD: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     slotE: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     slotF: { type: mongoose.Schema.ObjectId, ref: 'User' },
//     notes: { type: String }
// });

module.exports = mongoose.model('Vacation', vacationSchema);