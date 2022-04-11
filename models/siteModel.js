const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const SiteSchema = new mongoose.Schema({
    riaDivision: {
        type: String,
        required: true,
        trim: true
    },
    facilityOrganization: {
        type: String,
        required: true,
        trim: true
    },
    facilityName: {
        type: String,
        required: true,
        trim: true
    },
    facilityType: {
        type: String,
        required: true,
        trim: true
    },
    slug: String,
    photo: String,
    tags: [String],
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an addres!'
        }
    },
    author: {
        type: mongoose.Schema.ObjectId,
        // ref: 'UserPassport',
        ref: 'User',
        required: 'You must supply an author'
    },
    created: { type: Date, default: Date.now }
}, {
    // this will bring any virtuals along for the ride so they don't have to be explicitly called
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Define our indexes
// Indexing is used in MONGO DB for faster searches
SiteSchema.index({
    facilityName: 'text',
    facilityType: 'text'
});

SiteSchema.index({
    location: '2dsphere'
})

SiteSchema.pre('save', async function(next) {
    if (!this.isModified('facilityName')) {
      next(); // skip it
      return; // stop this function from running
    }
    this.slug = slug(this.facilityName);
    // find other stores that have a slug of ex. wes, wes-1, wes-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const sitesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (sitesWithSlug.length) {
      this.slug = `${this.slug}-${sitesWithSlug.length + 1}`;
    }
    next();
    // TODO make more resiliant so slugs are unique
  });

// This is how we put a method on the schema...with statics
// We will use a "proper" function so we can use THIS inside it
SiteSchema.statics.getTagsList = function() {
    return this.aggregate([
        // Now go to mongodb aggegate operators
        // Basically a way to do complex queries
        // Pipeline is the array
        // using $ tells them that $tags is a field on the document
        // unwind allows u to find instance of each and every tag ...not just one tag per site
        { $unwind: '$tags' },
        // $group will group tags based on _id and then create a count property that sums em up
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        // $sort will sort in ascending or descending order
        { $sort: { count: -1 }}
    ]);
}

SiteSchema.statics.getTopSites = function() {
    return this.aggregate([
        // lookup sites and populate their reviews
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'site', as: 'reviews' }},
        // filter for only items with 2 or more reviews
        // reviews.1 is how u access indexed items in Mongo db
        { $match: { 'reviews.1': { $exists: true } }},
        // add the average review fields
        { $project: {
            photo: '$$ROOT.photo',
            name: '$$ROOT.facilityName',
            reviews: '$$ROOT.reviews',
            slug: '$$ROOT.slug',
            // $reviews.rating is being piped in with the match
            // $ sign means it is being piped in
            averageRating: { $avg: '$reviews.rating' }
        }},
        // sore it by our new field, highest reviews first
        { $sort: { averageRating: -1 }},
        // limit to at most 10
        { $limit: 3 }
    ]);
}

// Virtual allows models to reference each other ...in a way
// Find reviews where the stores _id === reviews store property
// Virtual fields will not "go into" a json unles you explicitly call it ex. site.reviews
SiteSchema.virtual('reviews', {
    ref: 'Review', // what model to link?
    localField: '_id', // which field on the site?
    foreignField: 'site' // which field on the review?
});

var Site = mongoose.model('Site', SiteSchema);
module.exports = Site;