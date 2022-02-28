const { Store } = require('express-session');
const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Site = mongoose.model('Site');

exports.addReview = async (req, res) => {
    req.body.author = req.user._id;
    req.body.site = req.params.id;
    // res.json(req.body);
    const newReview = new Review(req.body);
    console.log(newReview);
    await newReview.save();
    // req.flash('success', 'review Saved!');
    res.redirect('back');
};

exports.getTopSites = async (req, res) => {
    const sites = await Site.getTopSites();
    // res.json(sites);
    res.render('topSites', { sites, title: 'Top Sites!' }
    );
};