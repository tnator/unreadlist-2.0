const mongoose = require('mongoose');
const HoneyBadger = mongoose.model('HoneyBadger');


// HONEYBADGER MIDDLEWARE
exports.honeyBadgerCalculate = async (req, res, next) => {
    var startTime = req.body.startTime;
    var startTime = Date.parse(startTime);
    console.log(startTime);
    var endTime = req.body.endTime;
    var endTime = Date.parse(endTime);
    var num = (endTime - startTime) / 3600000;
    // limits to 2 decimal places
    req.body.shiftDuration = num.toFixed(2);
    var duration = req.body.shiftDuration;
    var rate = req.body.rate;
    req.body.fee = duration * rate;
    next();
};


// LOOK INTO DAY.JS FORMATTING


// HONEYBADDGER CONTROLLERS
exports.honeyBadgerDisplay = async (req, res) => {
    const shifts = await HoneyBadger.find({ });
    // console.log(req.body.startTime);
    res.render('honeyBadger', { title: 'Nighthawk', shifts });
};
exports.honeyBadgerAdd = async (req, res) => {
    console.log('Start honeybadger add')
    res.render('honeyBadgerAdd', { title: 'Nighthawk Add Shift' });
};
exports.honeyBadgerCreate = async (req, res) => {
    const shift = new HoneyBadger(req.body);
    console.log(shift.startTime);
    await shift.save();
    res.redirect('/honeyBadger');
};
exports.honeyBadgerEdit = async (req, res) => {
    const shift = await HoneyBadger.findOne({ _id: req.params.id });
    res.render('honeyBadgerAdd', { title: `Editing Shift ${shift.date} from ${shift.startTime} to ${shift.endTime}`, shift });
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