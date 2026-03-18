import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { sendMail } from '../helpers/mailer.js';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import mongoose from 'mongoose';
export const userRegister = async (req, res) => {
  try {


    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name, email, mobile } = req.body;
    const oFoundUser = await User.findOne({ email });
    if (oFoundUser) {
      return res.status(400).json({
        success: 'false',
        message: 'This Email-ID already exists. Please try to login or use different Email-ID'
        })
    }
    const reqUser = {
      name: name.trim(), email, mobile, password: hashedPassword,
      image: (() => {
        if (req.file) {
          return `'/images/'+${req.file.filename}`
        }
        else {
          return null;
        }
      })()
    };
    const user = await User.create(reqUser);

    const message = `<p>Please <a href="localhost:7000/employees/">verify<a> your email-ID`;
    const resEml = await sendMail(user.email,"User Verification from BPC",message);
    if(!(resEml instanceof Error )){
    res.status(201).json({
      success: true,
      message: 'An email has been sent to your Email-ID. Please verify the email to complete the registration process',
      user
    });
    }
    else{
      res.status(500).json({
        message: 'User is registered. Email Verification is pending. We are facing issue with sending user verification mails. Please try after some time or contact BPC Support - +1 892-627-7289'
      })
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message: err.message

    })
  }
}


export const emailVerify = async function(req, res ){
  try {
        const userId = req.query.id;

        // Scenario 1: ID is missing in the URL
        if (!userId) {
            return res.status(400).send('<h1>Error</h1><p>Invalid verification link.</p>');
        }

        // Scenario 2: Check if ID is a valid MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('<h1>Error</h1><p>Invalid ID format.</p>');
        }

        // Scenario 3: Find user and update their verification status
        const user = await User.findById(userId);

        if (!user) {
            // Scenario 4: User not found in database
            return res.status(404).send('<h1>Error</h1><p>User not found.</p>');
        }

        if (user.isVerified===1) {
            // Scenario 5: User is already verified
            return res.send('<h1>Already Verified</h1><p>Your email is already confirmed. Please log in.</p>');
        }

        // Update user status
        user.isVerified = 1;
        await user.save();

        // Scenario 6: Success - Send the actual HTML file
        // This file is NOT accessible via <HOST>:<PORT>/views/verification-success.html
        res.render('email-verif');

    } catch (error) {
        // Scenario 7: Server or Database error
        console.error(error);
        res.status(500).send('<h1>Server Error</h1><p>Something went wrong on our end.</p>');
    }
}