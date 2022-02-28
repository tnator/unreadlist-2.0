const mongoose = require('mongoose');
const UserPassport = mongoose.model('UserPassport');
// const { promisify } = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('loginPassport', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('registerPassport', { title: 'Register' });
};

// Registration middleware
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'Email is not valid!').isEmail();
    // Normalize modifiers used in some emails when registering
    req.sanitizeBody('email').normalizeEmail({
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
        res.render('registerPassport', { title: 'Register', body: req.body, flashes: req.flash() });
        // res.render('registerPassport', { title: 'Register', body: req.body });
        return;
    };
    next();
};
exports.register = async (req, res, next) => {
    console.log('register start');
    const user = new UserPassport({ name: req.body.name, email: req.body.email });

    // await user.setPassword('password');
    // await user.save();
    // const { user } = await UserPassport.authenticate()('user', 'password');

    // passportLocalMongoose exposes .register() to use for use
    // register doesn't return a promise but is callback based so use promisify
    // const register = promisify(UserPassport.register, UserPassport);
    // const register = (UserPassport.register, UserPassport);
    console.log('middle');
    await UserPassport.register(user, req.body.password);
    console.log('register end');
    next(); // pass to authcontroller.login
};

exports.profileEdit = (req, res) => {
    res.render('profileEdit', { title: 'My Profile' });
};
exports.profileUpdate = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };
    const user = await UserPassport.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        // context is required for mongoose
        { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated profile!');
    res.redirect('/profilePassport');

    // This sends person back
    // res.redirect('back');
};