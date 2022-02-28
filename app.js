const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// THIS ALLOWS US TO STORE SESSION DATA IN MONGO IN CASE OF NUMEROUS LOGGED IN USERS
var MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/routes');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');
// IMPORT SENSITIVE DATA FROM VARIABLES FILE
require('dotenv').config({ path: 'variables.env' });


// CONNECT TO MONGO DB
// Allows Mongoose to use ES6 async await promises
mongoose.connect(process.env.DATABASE);
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', (err) => {
  console.error(`ERROR → ${err.message}`);
});

// CREATE EXPRESS APP
const app = express();

// SETS VIEW ENGINE AS PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));

// STATIC FILES - BUILT INTO EXPRESS
app.use(express.static(path.join(__dirname + '/public')));

// PARSES JSON BODIES - BUILT INTO EXPRESS
app.use(express.json());
// PARSES URL ENCODED BODIES - BUILT INTO EXPRESS
// extended: true ALLOWS US TO USE INPUTS WITH NESTED DATA
app.use(express.urlencoded({ extended: true }));

// Exposes a bunch of methods for validating data. Used in userController.validateRegister
app.use(expressValidator());

// PARSES COOKIES - DEPENDENCY
app.use(cookieParser());

// USE SESSIONS FOR TRACKING LOGINS
app.use(session({
    secret: 'Radase is helpful',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    }) 
}));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});


// MIDDLEWARE PRIOR TO ROUTES

// MIDDLEWARE TO MAKE USER ID AVAILABLE IN TEMPLATES
// sets current userId to the currentUser variable to use in pug templates
// This is for the UBERUSER
app.use(function (req, res, next) {
    res.locals.currentUser = req.session.userId;
    if (req.session.userId === '61c925ccbaadc7b9fd40674d') {
        res.locals.uberUser = req.session.userId;
    };
    next();
});





// INCLUDE ROUTES
app.use('/', routes);

// ERROR HANDLERS
// FILE NOT FOUND ERROR
app.use(errorHandlers.notFound);

app.use(errorHandlers. developmentErrors);

// DEV ERROR
if (app.get('env') === 'development') {
    app.use(errorHandlers. developmentErrors);
};
// PRODUCTION ERROR
app.use(errorHandlers.productionErrors);

// EXPORT EXPRESS APP TO USE IN START.JS
module.exports = app;