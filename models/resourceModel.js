const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const resourceSchema = new mongoose.Schema({
    labelName: { type: String },
    url: { type: String, unique: true },
    notes: { type: String },
    created: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Resource', resourceSchema);