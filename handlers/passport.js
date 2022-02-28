const passport = require('passport');
const mongoose = require('mongoose');
const UserPassport = mongoose.model('UserPassport');

passport.use(UserPassport.createStrategy());

passport.serializeUser(UserPassport.serializeUser());
passport.deserializeUser(UserPassport.deserializeUser());