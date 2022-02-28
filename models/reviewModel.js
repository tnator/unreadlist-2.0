const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author!'
    },
    site: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: 'You must supply a store!'
    },
    text: {
        type: String,
        required: 'Your review must have a text!'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

// this will populate with the author instead of a number
function autopopulate(next) {
    this.populate('author');
    next();
}
// CAN'T GET THIS TO WORK Video 38
// reviewSchema.pre('find', autopopulate);
// reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', reviewSchema);