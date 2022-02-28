const nodemailer = require('nodemailer');
const pug = require('pug');
// JUICE INLINES CSS
const juice = require('juice');
const htmlToText = require('html-to-text');
const { promisify } = require('es6-promisify');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateHTML = (filename, options = {}) => {
    // console.log('start generateHTML');
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    // const html = pug.renderFile('./views/email/password-reset.pug', options);
    // console.log(html);
    // console.log('end generateHTML');
    const inlined = juice(html);
    return inlined;
};

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: `Admin <noreply@radase.com>`,
        to: options.user.email,
        subject: options.subject,
        html: html,
        text: text
    };
    console.log('before promisify sendmail');
    // const sendMail = promisify(transport.sendMail, transport);
    // const sendMail = transport.sendMail();
    // return sendMail(mailOptions);
    return transport.sendMail(mailOptions);
};


// TESTING CODE FOR MAILTRAP.IO
// transport.sendMail({
//    from: 'Ryan Tompkins <rtompkins21@icloud.com>',
//    to: 'ryan@example.com',
//    subject: 'Sample subject',
//    html: 'Hey I <strong>hate</strong> you',
//    text: 'Hey I **Hate you**'
// });