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
    // title - full, associate, employed, it, ceo, secretary
    // emailPrimary
    // emailSecondary
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

const UserSchema = new Schema({
    clearance: { type: String },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    initials: { type: String, max: 3, uppercase: true, required: true },
    title: { type: String },
    emailPrimary: { type: String, lowercase: true, required: true },
    emailSecondary: { type: String, lowercase: true },
    phonePrimary: { type: String, trim: true, required: true },
    phoneSecondary: { type: String, trim: true },
    specialty: { type: String },
    degree: { type: String },
    medSchool: { type: String },
    internship: { type: String },
    residency: { type: String },
    fellowship: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created: { type: Date, default: Date.now }
});



// All of this below is for the avatar when logged in
UserSchema.virtual('gravatar').get(function() {
    // return `https://pbs.twimg.com/profile_images/1274704764710813697/l33dIcxb_400x400.jpg`
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=50`;
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'emailPrimary' });
// UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', UserSchema);




// Old user schema
// const userSchema = new Schema({
//     email: {
//         type: String,
//         unique: true,
//         lowercase: true,
//         trim: true,
//         validate: [validator.isEmail, 'Invalid Email Address'],
//         required: 'Please supply an email address'
//     },
//     name: {
//         type: String,
//         required: 'Please supply a name',
//         trim: true
//     },
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     hearts: [
//         { type: mongoose.Schema.ObjectId, ref: 'Site' }
//     ],
//     created: { type: Date, default: Date.now }
// });