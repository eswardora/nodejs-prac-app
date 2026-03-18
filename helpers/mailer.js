import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    requireTLS: true,
    auth:{
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
    }
})
export const sendMail = async function(mail, subject, message){

  // Constructing the message with the sender's email included
  

  const mailOptions = {
    from: process.env.SMTP_MAIL,// the email captured from the form
    to: mail,// the email you want to receive emails
    subject: subject,// the subject captured
    html: message,// the message captured
  };
  try{
  const info = await transporter.sendMail(mailOptions);
  return info
  }catch(err){ return err }
};
