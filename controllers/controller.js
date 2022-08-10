const mongoose = require('mongoose');
// const Site = require('../models/siteModel');
// WTF IS THIS??
// const { BulkOperationBase } = require('mongoose/node_modules/mongodb');
const Contact = mongoose.model('Contact');
const Vacation = mongoose.model('Vacation');
const HoneyBadger = mongoose.model('HoneyBadger');
const Resource = mongoose.model('Resource');
const User = mongoose.model('User');
const Site = mongoose.model('Site');
const Quote = mongoose.model('Quote');
// const HoneyBadger = mongoose.model('HoneyBadger');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { rawListeners, findOneAndDelete } = require('../models/userPassportModel');
const { Store } = require('express-session');
const router = require('../routes');
const { response } = require('express');
const { getExpectedTwilioSignature } = require('twilio/lib/webhooks/webhooks');
// const twilio = require('twilio');

// Multer is for images
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype is not allowed' }, false);
        }
    }
};

// LOADS INDEX HOMEPAGE
exports.index = async (req, res) => {
    res.render('index', { title: 'Home' })
};
exports.indexMy = async (req, res) => {
    const profile = req.user
    const contacts = await Contact.find({ $or: [
        {tag: 'er'},
        {tag: 'stroke'},
        {tag: 'trauma'}
    ] });
    const shiftsUser = await HoneyBadger.find({ assigned: profile.initials });
    // const vacationUser = await Vacation.find({ $or: [
    //     {slotA: profile.initials},
    //     {slotB: profile.initials},
    //     {slotC: profile.initials},
    //     {slotD: profile.initials},
    //     {slotE: profile.initials},
    //     {slotF: profile.initials},
    //     {slotG: profile.initials},
    //     {slotH: profile.initials},
    // ] });
    const quotes = await Quote.aggregate([ {$sample:{size:1}} ]);
    res.render('indexMy', { title: 'Home', contacts, shiftsUser, quotes });
};
exports.quoteForm = async (req, res) => {
    res.render('quoteForm', { title: 'Add Quote' });
};
exports.quoteCreate = async (req, res) => {
    const quote = new Quote(req.body);
    await quote.save();
    console.log('Quote created');
    res.redirect('/');
};
exports.error = (req, res) => {
    res.render('error', { title: 'Error Page' });
};

// CONTACTS CONTROLLER OPERATIONS
exports.contactAdd = async (req, res) => {
    res.render('contactAdd', { title: 'Add Contact' });
};
exports.contactCreate = async (req, res) => {
    console.log(req.body);
    var phoneString = req.body.phoneNum;
    var phoneNoDash = phoneString.replace(/-/g, '');
    var iCode = '+1';
    var phoneNum = iCode.concat(phoneNoDash);
    const contact = new Contact({
        division: req.body.division,
        site: req.body.site,
        acronym: req.body.acronym,
        numLabel: req.body.numLabel,
        phoneNum: phoneNum,
        tag: req.body.tag,
        index: req.body.index,
    });
    await contact.save();
    console.log('Contact created');
    res.redirect('/contacts');
};
exports.contactsGet = async (req, res) => {
    const contacts = await Contact.find({ }).sort({ index: 1 });
    const rads = await User
        .find( { $or: [ { clearance: "uberUser" }, { clearance: "radUser" } ] } )
        .sort( { lastName : 1 } );

    // array Determines order of display on page
    const hospitalArray = [
        // 0s
        ['Ocala Regional Medical Center', 'ORMC'],
        // 100s
        ['West Marion Hospital', 'WMH'],
        // 200s
        ['Advent Hospital', 'AH'],
        // 300s
        ['Seven Rivers Hospital', 'SRMC'],
        // 400s
        ['Schneider Regional Medical Ctr', 'USVIST'],
        // 500s
        ['Juan F. Luis Medical Center', 'USVISC'],
    ];
    const erClinicArray = [
        // 600s
        ['Belleview ER', 'BVER'],
        // 610s
        ['Citrus Hills ER', 'CHER'],
        // 620s
        ['Maricamp ER', 'MCER'],
        // 630s
        ['Summerfield ER', 'SMER'],
        // 640s
        ['Timberridge ER', 'TRER'],
        // 650s
        ['Trailwinds ER', 'TWER'],
        // 660s
        ['Express Care', 'EC'],
    ];
    const outpatientArray = [
        // 700s
        ['Advanced Imaging Center', 'AI'],
        // 800s
        ['Medical Imaging Center', 'MIC'],
        // 900s
        ['Timberridge Imaging Center', 'TIC'],
        // 1000s
        ['Women\'s Imaging Center', 'WIC'],
        // 1100s
        ['Heart of Florida', 'HOF'],
        // 1200s
        ['Operations', 'OP']
    ];
    res.render('contacts', { title: 'Contacts',
        contacts,
        rads,
        hospitalArray,
        erClinicArray,
        outpatientArray
    });
};
exports.contactEdit = async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params.id });
    // res.render('contactEdit', { title: `Editing ${contact.acronym} | ${contact.numLabel}`, contact });
    res.render('contactEdit', { title: 'Edit Contact', contact });

};
exports.contactUpdate = async (req, res) => {
    var iCode = '+1';
    var string = req.body.phoneNum;
    if (string.includes('-')) {
        var noDash = string.replace(/-/g, '');
    } else {
        var noDash = string;
    };
    if (string.includes(iCode)) {
        req.body.phoneNum = noDash;
    } else {
        req.body.phoneNum = iCode.concat(noDash);
    };
    const contact = await Contact.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //return theh new contact instead of old contact
        runValidators: true //forces model to run the required fields
    }).exec(); // this runs the query
    // res.redirect(`/contacts/${contact._id}/edit`);
    res.redirect('/contacts');
};
exports.searchContacts = async (req, res) => {
    // const contacts = await Contact.find();
    // res.json(contacts);
    const contacts = await Contact
    // find contacts
    .find({
        // $text performs a search on content of any fields indexed with text index
        // as in the contactModel.js
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    })
    // sort contacts
    .sort({ 
        score: {$meta: 'textScore' }
    })
    // limit to 5 results
    .limit(5);
    res.json(contacts);
};


// VACATION CONTROLLER OPERATIONS
exports.vacationGet = async (req,res) => {
    const profile = req.user;
    const vacation = await Vacation
        .find({ })
        // .populate('slotA slotB slotC slotD slotE slotF slotG slotH')
        .sort({ 'weekNum': 1 });
    const vacationUser = await Vacation.find({ $or: [
        {slotA: profile.initials},
        {slotB: profile.initials},
        {slotC: profile.initials},
        {slotD: profile.initials},
        {slotE: profile.initials},
        {slotF: profile.initials},
        {slotG: profile.initials},
        {slotH: profile.initials},
    ]});
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    
    // const count = await Vacation.count({ $or: [
    //     {slotA: 'rkt'},{slotB: 'rkt'},{slotC: 'rkt'},{slotD: 'rkt'},{slotE: 'rkt'},{slotF: 'rkt'},{slotG: 'rkt'},{slotH: 'rkt'}
    // // ], [
    // //     {slotA: 'crr'},{slotB: 'crr'},{slotC: 'crr'},{slotD: 'crr'},{slotE: 'crr'},{slotF: 'crr'},{slotG: 'crr'},{slotH: 'crr'}
    // ]});

    // const count2 = await Vacation.aggregate([
    //     { $group: {slotA:'rkt', count: { $sum:1 }}}
    // ])
    // consolt.log(count2);

    res.render('vacation', { title: 'Vacation 2022', profile, vacation, vacationUser, users});
};
exports.vacationAdd = async (req,res) => {
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    const vacation = await Vacation
        .find({})
        .sort({ 'weekNum': -1 })
        .limit(1);
    res.render('vacationAdd', { title: 'Vacation Add Page', users, vacation });
};
exports.vacationCreate = async (req, res) => {
    // var start = new Date(req.body.startDate);
    // var startDateOffset = start.getTimezoneOffset() / 60;
    // var end = new Date(req.body.endDate);
    // var endDateOffset = end.getTimezoneOffset() / 60;
    const vacation = new Vacation({
        weekNum: req.body.weekNum,
        startDate: req.body.startDate,
        // startDate: req.body.startDate,
        // startDateOffset: startDateOffset,
        endDate: req.body.endDate,
        // endDateOffset: endDateOffset,
        slotA: req.body.slotA,
        slotB: req.body.slotB,
        slotC: req.body.slotC,
        slotD: req.body.slotD,
        slotE: req.body.slotE,
        slotF: req.body.slotF,
        slotG: req.body.slotG,
        slotH: req.body.slotH,
        notes: req.body.notes
    });
    await vacation.save();
    res.redirect('/vacation');
};
exports.vacationEdit = async (req, res) => {
    const week = await Vacation
        .findOne({ _id: req.params.id })
        // .populate('slotA slotB slotC slotD slotE slotF slotG slotH');
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    // render edit form so can update/edit
    res.render('vacationAdd', { title: `Editing Week ${week.weekNum}`, week, users });
};
exports.vacationUpdate = async (req, res) => {
    const contact = await Vacation.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.redirect('/vacation');
};
exports.vacationDelete = async (req, res) => {
    const vacation = await Vacation.findOneAndDelete({ _id: req.params.id }, req.body ).exec();
    res.redirect('/vacation');
};


// RESOURCES CONTROLLER OPERATIONS
exports.resourcesGet = async (req, res) => {
    const resource = await Resource.find({});
    res.render('resources', { title: 'Resources', resource });
};
exports.resourceAdd = async (req, res) => {
    res.render('resourceAdd', { title: 'Resource Add Page' });
};
exports.resourceCreate = async (req, res) => {
    const resource = new Resource(req.body);
    await resource.save();
    res.redirect('/resources');
};
exports.resourceEdit = async (req, res) => {
    const resourceItem = await Resource.findOne({ _id: req.params.id });
    res.render('resourceAdd', { title: `Editing Resource ${resourceItem.labelName}`, resourceItem });
};
exports.resourceUpdate = async (req, res) => {
    const resource = await Resource.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.redirect('/resources');
};
exports.resourceDelete = async (req, res) => {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id }, req.body ).exec();
    res.redirect('/resources');
}


// AUTHENTICATION & AUTHORIZATION
exports.registerGet = async (req, res, next) => {
    res.render('register', { title: 'Register' });
};
exports.registerPost = async (req, res, next) => {
    if (req.body.firstName &&
        req.body.lastName &&
        req.body.initials &&
        req.body.email &&
        req.body.password &&
        req.body.confirmPassword) {
            console.log('Fields filled out');
            // confirm user typed same password
            if (req.body.password !== req.body.confirmPassword) {
                var err = new Error('Passwords do not match.')
                console.log(err);
                res.redirect('/error');
                // var err = new Error('Passwords do not match.');
                // err.status = 400;
                // return next(err);
            } else {
                const user = new User(req.body);
                await user.save();
                // Once registered they are automatically logged in
                req.session.userId = user._id;
                res.redirect('/profile');
            }
        } else {
            var err = new Error('Fields not filled out!')
            console.log(err);
            res.redirect('/error');
            // var err = new Error('All fields required.');
            // err.status = 400;
            // return next(err);
        };
};
exports.loginGet = async (req, res, next) => {
    res.render('login', { title: 'Log In' });
};
exports.loginPost = async (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                console.log(err);
                return res.redirect('/login');
                err.status = 401;
                return next(err);
            } else {
                console.log('Should be on profile page')
                req.session.userId = user._id;
                return res.redirect('/profile');
            };
        });
    } else {
        var err = new Error('Email & Password are required');
        console.log(err);
    };
};
exports.profileGet = async (req, res, next) => {
    // DONT NEED FOLLOWING CODE BECAUSE WE CREATED MIDDLEWARE requiresLogin
    // if (! req.session.userId) {
    //     var err = new Error('You are not authorized to view this page');
    //     console.log(err);
    //     err.status = 403;
    //     return next(err);
    // }
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                return res.render('profile', { title: 'Profile', user: user });
            }
        });
};
exports.logout = async (req, res, next) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            };
        });
    };
};



// LOCATION CONTROLLERS
// exports.sitesDisplay = async (req, res, next) => {
//     // populate will populate sites with all the reviews
//     const sites = await Site.find({}).populate('reviews');
//     res.render('sites', { title: 'Sites', sites });
// };

exports.sitesDisplay = async (req, res, next) => {
    const page = req.params.page || 1;
    const limit = 4;
    const skip = (page * limit) - limit;
    // populate will populate sites with all the reviews
    // const sites = await Site.find({}).populate('reviews');
    const sitesPromise =  Site
        .find({})
        .skip(skip)
        .limit(limit)
        .populate('reviews');

    const countPromise = Site.count();

    const [sites, count] = await Promise.all([sitesPromise, countPromise]);

    const pages = Math.ceil(count / limit);
    if (!sites.length && skip) {
        req.flash('info', `Hey! You asked for page ${page} that doesn't exist.`);
        res.redirect(`/sites/page/${pages}`);
        return;
    }
    res.render('sites', { title: 'Sites', sites, page, pages, count });
};
exports.siteAddGet = async (req, res, next) => {
    res.render('siteAdd', { title: 'Sites Add' });
};
// MIDDLEWARE FOR PHOTOS
exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
    if(!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};
exports.siteAddPost = async (req, res, next) => {
    req.body.author = req.user._id;
    const site = new Site(req.body);
    await site.save();
    req.flash('success', `Successfully Created ${site.facilityName}. Thanks!`);
    res.redirect('/sites');
};
const confirmOwner = (site, user) => {
    // Can add || or && statements in if statement below to create user levels
    // for example:  || user.level < 10    ...but have to create user levels
    if (!site.author.equals(user._id)) {
        throw Error('You must own a site in order to edit it!');
    }
};
exports.siteEditDisplay = async (req, res) => {
    // FIND THE SITE WITH GIVEN ID
    const site = await Site.findOne({ _id: req.params.id });
    // CONFIRM LOGGED IN PERSON IS SITE OWNER/CREATOR
    confirmOwner(site, req.user);
    // RENDER OUT EDIT FORM SO USER CAN UPDATE THEIR STORE
    res.render('siteAdd', { title: `Editing Site ${site.facilityName}`, site });
};
exports.siteEditUpdate = async (req, res, next) => {
    // set location data to point
    req.body.location.type = 'Point';
    // find and update site
    const site = await Site.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.redirect('/sites');
};
exports.siteDelete = async (req, res) => {
    const site = await Site.findOneAndDelete({ _id: req.params.id }, req.body ).exec();
    // FIGURE OUT HOW TO DELETE UPLOADED FILES
    res.redirect('/sites');
}
exports.getSiteBySlug = async (req, res) => {
    const site = await (await Site.findOne({ slug:req.params.slug })).populate('author reviews');
    if (!site) {
        return next();
    }
    res.render('site', { site, title: site.facilityname });
};
exports.getSitesByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true }
    const tagsPromise = Site.getTagsList();
    const sitesPromise = Site.find({ tags: tagQuery });
    // Now wait for both promises
    const [tags, sites] = await Promise.all([ tagsPromise, sitesPromise ]);
    res.render('tags', { title: 'Tags', tags, sites, tag })
};
exports.searchSites = async (req, res) => {
    // res.json({ it: 'Worked' });
    // res.json(req.query);
    // const sites = await Site.find();
    // res.json(sites);
    // find sites that match
    const sites = await Site
    // find sites
    .find({
        // $text performs a search on content of any fields indexed with text index
        // as in the siteModel.js
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    })
    // sort sites
    .sort({ 
        score: { $meta: 'textScore' }
    })
    // limit to 5 results
    .limit(5);
    res.json(sites);
};


// MAP CONTROLLERS
exports.mapSites = async (req, res) => {
    // map(parseFloat) will change the string to true numbers
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    // res.json(coordinates);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: 100000 // 100 km
            }
        }
    };
    // findings sites and selecting certain properties (can also deselect with a -)
    // makes our ajax request faster
    const sites = await Site.find(q).select('facilityName facilityType tags location photo');
    res.json(sites);
};
exports.mapPage = async (req, res) => {
    res.render('map', { title: 'Map' });
};


// HEART CONTROLLERS
exports.heartSite = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    // console.log(hearts);
    // res.json(hearts);
    // $pull mongo db operator to remove if present but $addToSet if not
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
        .findByIdAndUpdate(req.user._id, 
            { [operator]: { hearts: req.params.id }},
            { new: true }   
    );
    res.json(user);
};
exports.getHearts = async (req, res) => {
    const sites = await Site.find({
       _id: { $in: req.user.hearts } 
    });
    // res.json(sites);
    res.render('sites', { title: 'Hearted Sites', sites: sites });
};