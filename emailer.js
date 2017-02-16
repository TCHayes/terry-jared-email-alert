'use strict';

const nodemailer = require('nodemailer');
const {logger} = require('./utilities/logger');

// stored in `.env` -- never store passwords, api keys
// etc. inside source code
const {SMTP_URL, ALERT_FROM_EMAIL, ALERT_FROM_NAME, ALERT_TO_EMAIL} = process.env;


const defaultEmailData = {
  from: ALERT_FROM_EMAIL,
  to: ALERT_TO_EMAIL,
  subject: ALERT_FROM_NAME,
  text: "test data",
  html: "<p>Test data</p>"
};

// `emailData` is an object that looks like this:
// {
//  from: "foo@bar.com",
//  to: "bizz@bang.com, marco@polo.com",
//  subject: "Hello world",
//  text: "Plain text content",
//  html: "<p>HTML version</p>"
// }


const sendEmail = (emailData, smtpUrl=SMTP_URL) => {
  const completeEmailData = Object.assign(defaultEmailData, emailData);
  const transporter = nodemailer.createTransport(SMTP_URL);
  logger.info(`Attempting to send email from ${completeEmailData.from}`);
  return transporter
    .sendMail(completeEmailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
}


module.exports = {sendEmail};
