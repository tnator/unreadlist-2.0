
// EXAMPLE OF ROUTER MIDDLEWARE
// CHECKS FOR SESSION AND USERID VALUES.
// IF BOTH TRUE MEANS USER IS LOGGED IN AND SEND TO PROFILE PAGE

function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        // REDIRECT USER TO PROFILE PAGE IF LOGGED IN
        return res.redirect('/profile');
    };
    return next();
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        console.log('You must be logged in to view this page.');
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

function adminLoggedIn(req, res, next) {
    // Change userId to variable or use admin status from db
    if (req.session && req.session.userId === '61c925ccbaadc7b9fd40674d') {
        console.log('Admin logged in');
        return next();
    } else {
        console.log('You must admin uberuser.');
        var err = new Error('You must admin uberuser.');
        err.status = 401;
        return next(err);
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.adminLoggedIn = adminLoggedIn;