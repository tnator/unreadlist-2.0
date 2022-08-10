const mongoose = require('mongoose');
const Stats = mongoose.model('Stats');
const User = mongoose.model('User');

exports.statsDisplay = async (req, res) => {
    const stats = await Stats.find({ });
    // console.log(stats);
    var ormcArray = [];
    var ormcirArray = [];
    var wmhArray = [];
    var ahArray = [];
    var ahirArray = [];
    var srArray = [];
    // var spotArray = ['ormc', 'ormcir', 'wmh', 'ah', 'ahir', 'sr', 'mic', 'tic', 'wic', 'ai', 'oneNine', 'twoTen', 'threeEleven', 'fourTwelve', 'elevenSeven'];
    // console.log(spotArray[0])
    for (let i=0; i<stats.length; i++) {
        ormcArray.push(stats[i].ormc.rvu);
        ormcirArray.push(stats[i].ormcir.rvu);
        wmhArray.push(stats[i].wmh.rvu);
        ahArray.push(stats[i].ah.rvu);
        ahirArray.push(stats[i].ahir.rvu);
        srArray.push(stats[i].sr.rvu);
        // micArray.push(stats[i].mic.rvu);
    };

    // this is not going to work due to blank spots in stats
    // need to get array of values that are present only
    // try grabbing innerHTML and use script.js


    const ormcAvg = ormcArray.reduce((x, y) => x + y, 0) / ormcArray.length;
    const ormcirAvg = ormcirArray.reduce((x, y) => x + y, 0) / ormcirArray.length;
    const wmhAvg = wmhArray.reduce((x, y) => x + y, 0) / wmhArray.length;
    const ahAvg = ahArray.reduce((x, y) => x + y, 0) / ahArray.length;
    const ahirAvg = ahirArray.reduce((x, y) => x + y, 0) / ahirArray.length;
    const srAvg = srArray.reduce((x, y) => x + y, 0) / srArray.length;

    const averageArray = [ormcAvg, ormcirAvg, wmhAvg, ahAvg, ahirAvg, srAvg];
    
    // console.log(average);
    // const averageFxn = array => array.reduce((x, y) => x + y, 0) / array.length;
    // console.log(averageFxn(arrayTest).toFixed(1));
    res.render('stats', { title: 'Statistics', stats, averageArray })
};

exports.statsForm = async (req, res) => {
    const rads = await User.find({ }).sort({ "lastName": 1 });
    res.render('statsForm', { title: 'Stats Form', rads });
};

exports.statsAdd = async (req, res) => {
    const stats = new Stats(req.body);
    await stats.save();
    res.redirect('/stats');
};