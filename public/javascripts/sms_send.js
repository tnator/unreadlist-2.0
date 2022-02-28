// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

//  FIGURE OUT HOW TO REPLACE THE TOKENS BELOW IN ACTIVE ENV
const accountSid = 'xxx';
const authToken = 'xxx';

const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Your shift starts in 1 hr! Enjoy',
        from: '+18647749745',
        to: '+13528710240'
    })
    .then(message => console.log(message.sid));