const dotenv = require("dotenv");
// CONFIGURING .ENV FILE TO USE VALUES STORED IN IT
dotenv.config();

const nodemailer = require("nodemailer"); //IMPORTING MAIL SENDING PACKAGE


 //FUNCTION TO CREATE MAIL SENDER USING NODEMAILER FUNCTION

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PWD
  },
});                                    



//FUNCTION TO SEND MAIL TO THE USER BASED ON REQUEST

const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to,
            subject,
            html
        });                                    
        console.log(`Email sent to ${to}`);
        
    } catch (error) {
        console.error(`Error! sending email to ${to}`, error)
        throw new Error("Failed to send mail")
    
    }
}


module.exports = sendMail

