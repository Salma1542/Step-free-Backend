const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
 const transporter = nodemailer.createTransport({
 service: "gmail",
 auth: {
 user: process.env.EMAIL_USER,
 pass: process.env.EMAIL_PASS,
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
};

module.exports = sendEmail;