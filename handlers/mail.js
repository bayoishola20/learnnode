const nodemailer = require('nodemailer');
const juice = require('juice');
const pug = require('pug');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateHTML = (filename, options = {}) => {
   const html = pug.renderFile(`${__dirname}/../../views/email/${filename}.pug`, options);
   console.log(html);
   return html;
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const mailOptions = {
        from: `bayoishola20 <noreply@bayoishola20.com`,
        to: options.user.email,
        subject: options.subject,
        html: html,
        text: 'From store  app'

    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}

/*transport.sendMail({
    from: 'Bayoishola20<bayoishola20@yahoo.com>',
    to: 'bayoishola20@yahoo.com',
    subject: 'Quick test',
    html: '<strong>Hi<strong/> Glad to have you here',
    text: '**Hi** Glad to have you here'
});*/