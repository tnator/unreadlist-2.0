const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = require('mongodb').ObjectId

exports.admin = async (req, res) => {
    const users = await User.find({ }).sort({ lastName: 1 });
    const partners = await User
        .find({ title: 'Partner Radiologist' })
        .sort({ 'lastName': 1 });
    const associates = await User
        .find({ title: 'Associate Radiologist' })
        .sort({ 'lastName': 1 });
    const employees = await User
        .find({ title: 'Employed Radiologist' })
        .sort({ 'lastName': 1 });
    const daytonas = await User
        .find({ title: 'Daytona Radiologist' })
        .sort({ 'lastName': 1 });
    res.render('admin', { title: 'Admin page', users, partners, associates, employees, daytonas });
};

exports.adminProfileEdit = async (req, res) => {
    const userId = req.body;
    const idString = userId.user;
    const id = ObjectId(idString);
    const profile = await User.findOne({ _id: id });
    res.render('profileEdit', { profile });
};