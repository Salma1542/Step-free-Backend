const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
 try {

const transporter = nodemailer.createTransport({
 service: "gmail",

 auth: {
 user: process.env.EMAIL_USER,
 pass: process.env.EMAIL_PASS,
 },

 tls: {
 rejectUnauthorized: false,
 },

 });

 await transporter.verify();

 console.log("SMTP Connected");

 await transporter.sendMail({
 from: process.env.EMAIL_USER,
 to: options.email,
 subject: options.subject,
 text: options.message,
 });

 console.log("EMAIL SENT");

 } catch (err) {
 console.log(err);
 throw err;
 }
};

module.exports = sendEmail;