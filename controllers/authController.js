const passport = require('passport');
// crypto module built into nodejs
const crypto = require('crypto');
const mongoose = require('mongoose');
// const userPassportModel = require('../models/userPassportModel');
const User = require('../models/userPassportModel');
const mail = require('../handlers/mail');
const promisify = require('es6-promisify');

// Strategy is something that checks with db to see if u are allowed to be logged in
// ex. strategy for facebook
// ex....exports.login = passport.authenticate('facebook')
// we are using local strategy
// Need to configure passport to use local, facebook, etc.
exports.login = passport.authenticate('local', {
    failureRedirect: '/loginPassport',
    failureFlash: 'Failed Login!',
    successRedirect: '/indexMy',
    // successFlash: 'You are now logged in'
});

exports.logout = (req, res) => {
    req.logout();
    // req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

// MIDDLEWARE isLoggedIn
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    } 
    req.flash('error', 'Oops..you must be logged in');
    res.redirect('/loginPassport');
};
exports.isUberUser = (req, res, next) => {
    if(res.locals.clearance === 'uberUser') {
        next();
        return;
    }
    req.flash('error', 'You are not an Uber User');
    res.redirect('/');
};

exports.forgot = async (req, res) => {
    // See if user exists
    const user = await User.findOne({ email: req.body.emailPrimary });
    if(!user) {
        req.flash('error', 'Password reset emailed if account exists');
        return res.redirect('/loginPassport');
    };
    // Set reset tokens and expiry on account
        // randomBytes() is built in method in crypto
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // Send them an email with the token
        // Would never do this in real world. Just doing for dev
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user: user,
        subject: 'Password Reset',
        resetURL: resetURL,
        filename: 'password-reset'
    });
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`);
    console.log(resetURL);
    res.redirect('/loginPassport');
    // redirect to login page
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        // $gt is a mongoose thing
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired.');
        return res.redirect('/loginPassport');
    };
    // if there is a user, show the reset password form
    res.render('loginReset', { title: 'Reset your password' });
};

//MIDDLEWARE confirmedPasswords
exports.confirmedPasswords = (req, res, next) => {
    //written with square brackets because of hyphen
    if (req.body.password === req.body['password-confirm']) {
        console.log('Passwords Match!');
        next();
        return;
    };
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    console.log('start update');
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        // $gt is a mongoose thing
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired.');
        return res.redirect('/loginPassport');
    };
    console.log('User found');
    // const setPassword = promisify(user.setPassword, user);
    await user.setPassword(req.body.password);
    console.log('resetting token and password to undefined');
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Saves resets as undefined
    const updatedUser = await user.save();
    console.log('Start log in updated user');
    console.log(updatedUser);
    // req.flash('Success', 'Your password has been reset!');
    res.redirect('/loginPassport');



    // CAN'T GET THE LOGIN TO WORK!!
    // await req.logIn(updatedUser);
    // req.flash('Success', 'Your password has been reset! You are now logged in!');
    // res.redirect('/');
};