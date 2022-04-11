const mongoose = require('mongoose');
const { findOne } = require('../models/userPassportModel');
const User = mongoose.model('User');
const Vacation = mongoose.model('Vacation');
const HoneyBadger = mongoose.model('HoneyBadger');
// const { promisify } = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('loginPassport', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register New User' });
};

// Registration middleware
exports.validateRegister = (req, res, next) => {
    console.log('start validateRegister');
    req.sanitizeBody('firstName');
    req.sanitizeBody('lastName');
    req.checkBody('firstName', 'You must supply a name!').notEmpty();
    req.checkBody('emailPrimary', 'Email is not valid!').isEmail();
    // Normalize modifiers used in some emails when registering
    req.sanitizeBody('emailPrimary').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Check it yo! Your passwords do not match!').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        console.log('Error with validation');
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        // res.render('registerPassport', { title: 'Register', body: req.body });
        return;
    };
    next();
};
exports.register = async (req, res, next) => {
    // const user = new User({ name: req.body.name, email: req.body.email });
    const user = new User({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        initials: req.body.initials,
        emailPrimary: req.body.emailPrimary,
        phonePrimary: req.body.phonePrimary
    });

    // await user.setPassword('password');
    // await user.save();
    // const { user } = await User.authenticate()('user', 'password');

    // passportLocalMongoose exposes .register() to use for use
    // register doesn't return a promise but is callback based so use promisify
    // const register = promisify(User.register, User);
    // const register = (User.register, User);
    await User.register(user, req.body.password);
    next(); // pass to authcontroller.login
};

exports.profileDisplay = async (req, res) => {
    const profile = req.user
    const honeyBadger = await HoneyBadger.find({ assigned: profile.initials });
    const vacationWeeks = await Vacation.find({ $or: [
        {slotA: profile.initials},
        {slotB: profile.initials},
        {slotC: profile.initials},
        {slotD: profile.initials},
        {slotE: profile.initials},
        {slotF: profile.initials},
    ]});
    res.render('profileDisplay', { title: 'My Profile', profile, honeyBadger, vacationWeeks });
};
exports.profileEdit = async (req, res) => {
    const profile = await User.findOne({ _id: req.params.id });
    res.render('profileEdit', { title: 'Edit My Profile', profile });
};
exports.profileUpdate = async (req, res) => {
    const updates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        initials: req.body.initials,
        title: req.body.title,
        specialty: req.body.specialty,
        clearance: req.body.clearance,
        emailPrimary: req.body.emailPrimary,
        emailSecondary: req.body.emailSecondary,
        phonePrimary: req.body.phonePrimary,
        phoneSecondary: req.body.phoneSecondary,
        specialty: req.body.specialty,
        medSchool: req.body.medSchool,
        degree: req.body.degree,
        internship: req.body.internship,
        residency: req.body.residency,
        fellowship: req.body.fellowship,
    };
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        // context is required for mongoose
        { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated profile!');
    res.redirect('/profileDisplay');

    // This sends person back
    // res.redirect('back');
};