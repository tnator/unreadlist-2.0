const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const quoteSchema = new mongoose.Schema({
    quote: { type: String, trim: true, required: true },
    author: { type: String, trim: true }
});

var Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;