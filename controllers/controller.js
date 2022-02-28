const mongoose = require('mongoose');
// const Site = require('../models/siteModel');
// WTF IS THIS??
// const { BulkOperationBase } = require('mongoose/node_modules/mongodb');
const Contact = mongoose.model('Contact');
const Vacation = mongoose.model('Vacation');
const Resource = mongoose.model('Resource');
const User = mongoose.model('UserPassport');
const Site = mongoose.model('Site');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { rawListeners } = require('../models/userPassportModel');
const { Store } = require('express-session');
const router = require('../routes/routes');
const { response } = require('express');
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
exports.homePage = (req, res) => {
    // req.flash('info', 'Welcome to the homepage!');
    res.render('index', {title: 'Home'});
};
exports.error = (req,res) => {
    res.render('error', { title: 'Error Page' });
}

// CONTACTS CONTROLLER OPERATIONS
exports.contactAdd = async (req, res) => {
    res.render('contactAdd', { title: 'Add Contact' });
};
exports.contactCreate = async (req, res) => {
    // will only pick up form fields described in the schema
    const contact = new Contact(req.body);
    await contact.save();
    console.log('Contact created');
    res.redirect('/contacts');
};
exports.contactsGet = async (req, res) => {
    const contacts = await Contact.find({ });
    // array Determines order of display on page
    const siteArray = [
        ['Ocala Regional Medical Center', 'ORMC'],
        ['West Marion Hospital', 'WMH'],
        ['Advent Hospital', 'AH'],
        ['Seven Rivers Hospital', 'SRMC'],
        ['Belleview ER', 'BVER'],
        ['Citrus Hills ER', 'CHER'],
        ['Maricamp ER', 'MCER'],
        ['Summerfield ER', 'SMER'],
        ['Timberridge ER', 'TRER'],
        ['Trailwinds ER', 'TWER'],
        ['US Virgin Islands', 'USVI'],
        ['Advanced Imaging Center', 'AI'],
        ['Medical Imaging Center', 'MIC'],
        ['Timberridge Imaging Center', 'TIC'],
        ['Women\'s Imaging Center', 'WIC'],
        ['Express Care', 'EC'],
        ['Heart of Florida', 'HOF'],
        ['Operations', 'OP']
    ];
    res.render('contacts', { title: 'Contacts',
        contacts,
        siteArray,
    });
};
exports.contactEdit = async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params.id });
    res.render('contactEdit', { title: `Editing ${contact.acronym} ${contact.numLabel}`, contact });
};
exports.contactUpdate = async (req, res) => {
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
    const vacation = await Vacation.find({}).sort({ "weekNum" : 1 });
    res.render('vacation', { title: 'Vacation 2022', vacation });
};
exports.vacationAdd = async (req,res) => {
    res.render('vacationAdd', { title: 'Vacation Add Page' });
};
exports.vacationCreate = async (req, res) => {
    // will only pick up form fields described in the schema
    const vacation = new Vacation(req.body);
    await vacation.save();
    res.redirect('/vacation');
};
exports.vacationEdit = async (req, res) => {
    const vacationWeek = await Vacation.findOne({ _id: req.params.id });
    // render edit form so can update/edit
    res.render('vacationAdd', { title: `Editing Week ${vacationWeek.weekNum}`, vacationWeek });
};
exports.vacationUpdate = async (req, res) => {
    const contact = await Vacation.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.redirect('/vacation');
};

// HONEYBADDGER CONTROLLERS
exports.honeyBadgerGet = async (req, res) => {
    res.render('honeyBadger', { title: 'Honey Badger Shifts' });
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

// CONNECT TO TWILIO MESSAGING
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilio = require('twilio')(accountSid, authToken);
const sosArray = ['+13528710240'];

// SMS CONTROLLERS
exports.smsGet = async (req, res) => {
    res.render('sms', { title: 'SMS' });
};
exports.smsPost = async (req, res) => {
        Promise.all(
        sosArray.map(sos => {
            return twilio.messages.create({
                to: sos,
                from: twilioNumber,
                body: req.body.sms
            });
        })
    )
    .then(messages => {
        console.log('Messages Sent!');
    })
    .catch(err => console.error(err));
    res.render('sms', { title: 'Send Message (SMS) Page' });
};