const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
// Pretties up login errors
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// Passport handles adding password to schema and other goodies
const passportLocalMongoose = require('passport-local-mongoose');

// ME - uberUser
// RADIOLOGIST - userRad
    // accessLevel
    // firstName
    // lastName
    // initials
    // partnership level
    // email
    // primaryPhoneNum
    // secondaryPhoneNum
    // specialty
    //     neuro
    //     msk
    //     ir
    //     nucs
    //     mammo
    //     body
    //     chest
    // medical school
    // internship
    // residency
    // fellowship

// ADMINISTRATION - userAdmin
    // accessLevel
    // firstName
    // lastName
    // title
    // email
    // primaryPhoneNum
    // secondaryPhoneNum

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply an email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Site' }
    ],
    created: { type: Date, default: Date.now }
});

// All of this below is for the avatar when logged in
userSchema.virtual('gravatar').get(function() {
    // return `https://pbs.twimg.com/profile_images/1274704764710813697/l33dIcxb_400x400.jpg`
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=50`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('UserPassport', userSchema);