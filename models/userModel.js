const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
// const res = require('express/lib/response');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    initials: {
        type: String,
        unique: true,
        required: false,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    authLevel: {
        type: String,
        required: true
    },
    created: { type: Date, default: Date.now }
});
// AUTHENTICATE IMPUT AGAINST DATABASE DOCUMENTS
// REQUIRES THIS WHEN WE CALL MODEL IN OTHER FILES
// email and password below are submitted with the form
// callback is function added in the route/controller that will either log in or give error
// UserSchema.statics.authenticate = function(email, password, callback) {
UserSchema.statics.authenticate = async (email, password, callback) => {
    //exec method to perform the search and provide callback to process results
    await User.findOne({ email: email }).exec(function (error, user) {
            if (error) {
                console.log('Error with database query');
                return callback(error);
            } else if ( !user ) {
                var err = new Error('User not found');
                console.log(err);
                return callback(err);
            };
            // password is what is typed into log in form
            // user.password was retrieved from database
            console.log('start bcrypt')
            bcrypt.compare(password, user.password, function(error, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
            console.log('end bcrypt')
        });
    console.log('UserSchema statics end')
};

// HASH PASSWORD BEFORE SAVING TO DATABASE
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            console.log('error hashing');
            return next(err);
        }
        // REASSIGN PLAIN TEXT PASSWORD TO HASHED CREATED
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;