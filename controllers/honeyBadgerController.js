const mongoose = require('mongoose');
const HoneyBadger = mongoose.model('HoneyBadger');
const User = mongoose.model('User');


// HONEYBADGER MIDDLEWARE
exports.honeyBadgerCalculate = async (req, res, next) => {
    var startTime = req.body.startTime;
    // console.log(startTime);
    var startTime = Date.parse(startTime);
    // console.log(startTime);
    var endTime = req.body.endTime;
    // console.log(endTime);
    var endTime = Date.parse(endTime);
    // console.log(endTime);
    var num = (endTime - startTime) / 3600000;
    // console.log(num);
    // limits to 2 decimal places
    req.body.shiftDuration = num.toFixed(2);
    var duration = req.body.shiftDuration;
    // console.log(duration);
    var rate = req.body.rate;
    req.body.fee = duration * rate;
    next();
};


// LOOK INTO DAY.JS FORMATTING


// HONEYBADDGER CONTROLLERS
exports.honeyBadgerDisplay = async (req, res) => {
    const profile = req.user;
    const shifts = await HoneyBadger.find({ }).sort({ startTime: 1 });
    const shiftsUser = await HoneyBadger.find({ $or: [
        {assigned: profile.initials}
    ]})
    res.render('honeyBadger', { title: 'Nighthawk Shifts', profile, shifts, shiftsUser });
};
exports.honeyBadgerAdd = async (req, res) => {
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    res.render('honeyBadgerAdd', { title: 'Nighthawk Add Shift', users });
};
exports.honeyBadgerCreate = async (req, res) => {
    const shift = new HoneyBadger(req.body);
    console.log(shift.startTime);
    await shift.save();
    res.redirect('/honeyBadger');
};
exports.honeyBadgerEdit = async (req, res) => {
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    const shift = await HoneyBadger.findOne({ _id: req.params.id });
    res.render('honeyBadgerAdd', { title: 'Edit Shift', shift, users });

};
exports.honeyBadgerUpdate = async (req, res) => {
    const shift = await HoneyBadger.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.redirect('/honeyBadger');
};
exports.honeyBadgerDelete = async (req, res) => {
    const itemToDelete = await HoneyBadger.findOneAndDelete({ _id: req.params.id }, req.body ).exec();
    res.redirect('/honeyBadger');
};