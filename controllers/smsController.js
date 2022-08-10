const mongoose = require('mongoose');
const HoneyBadger = mongoose.model('HoneyBadger');
const User = mongoose.model('User');

// CONNECT TO TWILIO MESSAGING
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilio = require('twilio')(accountSid, authToken);
const sosArray = ['+13528710240'];

// exports.convertPhoneNumber = async (req, res) => {
//     const numbers = await User.find({ phonePrimary });
//     console.log(numbers);
// };

// SMS CONTROLLERS
// exports.smsGet = async (req, res) => {
//     res.render('sms', { title: 'SMS' });
// };
exports.smsPost = async (req, res) => {
    // Find an array of all phonePrimary in Users document
    const numbers = await User.distinct('phonePrimary');
    console.log(numbers);
    Promise.all(
        sosArray.map(sos => {
            return twilio.messages.create({
                to: sos,
                from: twilioNumber,
                body: req.body.sms
            });
        })
    )
    .then(messages => {
        console.log('Messages Sent!');
    })
    .catch(err => console.error(err));
    res.render('sms', { title: 'Send Message (SMS) Page' });
};
// TESTING SCHEDULING MESSAGE
exports.sendScheduledSms = async (req, res) => {
    // schedule message to be sent 16 minutes after current time
    const sendWhen = new Date(new Date().getTime() + 16 * 60000);
    // console.log(sendWhen);
    // send the SMS
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const message = await twilio.messages.create({
        from: messagingServiceSid,
        to: '+13528710240',  // ← your phone number here
        body: 'Testing Twilio scheduling messages BRUH 16min!',
        scheduleType: 'fixed',
        sendAt: sendWhen.toISOString(),
    });
    console.log(message.sid);
    res.render('sms', { title: 'SMS' });
};





// Create button with SMS post to schedule NH for 1 week
// It also sends me message in 1 week minus 30 minutes to schedule for the next week
// Make page to schedule whatever we want to go to whomever we want

exports.sms = async (req, res) => {
    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    res.render('sms', { title: 'SMS', users });
};
exports.smsSchedule = async (req, res) => {
    const messageToSend = req.body.message;
    console.log(messageToSend);
    const initials = req.body.initials;
    console.log(initials);
    const shifts = await HoneyBadger.find({ assigned: req.body.initials });
    console.log(shifts);
    const recipient = User.find({ initials: req.body.initials })
    console.log(recipient);
    for (let i=0; i<shifts.length; i++) {
        var sendWhen = shifts[i].startTime - 900;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
        const message = await twilio.messages.create({
            from: messagingServiceSid,
            to: recipientNumber,  // ← your phone number here
            body: messageToSend,
            scheduleType: 'fixed',
            sendAt: sendWhen.toISOString(),
        });
        console.log(message.sid);
    }
    
    // // schedule message to be sent 16 minutes after current time
    // const sendWhen = new Date(new Date().getTime() + 16 * 60000);
    // // console.log(sendWhen);
    // // send the SMS
    

    const users = await User
        .find({})
        .sort({ 'lastName': 1 });
    res.render('sms', { title: 'SMS', users });
};