const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const statSchema = new mongoose.Schema({
    date: { type: Date },
    ormc: { assigned: { type: String }, rvu: { type: Number } },
    ormcir: { assigned: { type: String }, rvu: { type: Number } },
    wmh: { assigned: { type: String }, rvu: { type: Number } },
    ah: { assigned: { type: String }, rvu: { type: Number } },
    ahir: { assigned: { type: String }, rvu: { type: Number } },
    sr: { assigned: { type: String }, rvu: { type: Number } },
    mic: { assigned: { type: String }, rvu: { type: Number } },
    tic: { assigned: { type: String }, rvu: { type: Number } },
    wic: { assigned: { type: String }, rvu: { type: Number } },
    ai: { assigned: { type: String }, rvu: { type: Number } },
    oneNine: { assigned: { type: String }, rvu: { type: Number } },
    twoTen: { assigned: { type: String }, rvu: { type: Number } },
    threeEleven: { assigned: { type: String }, rvu: { type: Number } },
    fourTwelve: { assigned: { type: String }, rvu: { type: Number } },
    elevenSeven: { assigned: { type: String }, rvu: { type: Number } }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stats', statSchema);