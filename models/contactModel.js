const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// CREATES URL FRIENDLY DATA
const slug = require('slugs');
const { LibManifestPlugin } = require('webpack');

// CONTACT TYPES
// -main
// -er/stroke 
// -reading rooms
// -radiology
// -it
// -units
// -staff
// -admin
// -rad


const contactSchema = new mongoose.Schema({
    division: { type: String, trim: true, required: 'Please select division' },
    site: { type: String, trim: true, },
    acronym: { type: String, trim: true, uppercase: true },
    numLabel: { type: String, trim: true },
    phoneNum: { type: String, trim: true },
    tag: [String],
    // tag: { type: String, trim: true },
    index: { type: Number, unique: true },
    created: { type: Date, default: Date.now }
});

// Define our indexes
// Indexing is used in MONGO DB for faster searches
contactSchema.index({
    division: 'text',
    site: 'text',
    acronym: 'text',
    numLabel: 'text',
    tag: 'text'
});

module.exports = mongoose.model('Contact', contactSchema);