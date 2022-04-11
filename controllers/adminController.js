const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = require('mongodb').ObjectId

exports.admin = async (req, res) => {
    const users = await User.find({ })
    res.render('admin', { title: 'Admin page', users });
};

exports.adminProfileEdit = async (req, res) => {
    const userId = req.body;
    const idString = userId.user;
    const id = ObjectId(idString);
    const profile = await User.findOne({ _id: id });
    res.render('profileEdit', { profile });
};