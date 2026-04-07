import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import log from "../helpers/logger.js";
import { User } from "../models/user.js";
import { sendMail } from "../helpers/mailer.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import mongoose from "mongoose";


export const userRegister = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name, email, mobile } = req.body;
    const oFoundUser = await User.findOne({ email });
    if (oFoundUser) {
      return res.status(400).json({
        success: "false",
        message:
          "This Email-ID already exists. Please try to login or use different Email-ID",
      });
    }
    const reqUser = {
      name: name.trim(),
      email,
      mobile,
      password: hashedPassword,
      image: (() => {
        if (req.file) {
          return `'/images/'+${req.file.filename}`;
        } else {
          return null;
        }
      })(),
    };
    const user = await User.create(reqUser);

    const message = `<p>Please <a href="http://localhost:${process.env.PORT}/users/email-verification?id=${user._id}">verify<a> your email-ID`;
    const resEml = await sendMail(
      user.email,
      "User Verification from BPC",
      message,
    );
    if (!(resEml instanceof Error)) {
      res.status(201).json({
        success: true,
        message:
          "An email has been sent to your Email-ID. Please verify the email to complete the registration process",
        user,
      });
    } else {
      res.status(500).json({
        message:
          "User is registered. Email Verification is pending. We are facing issue with sending user verification mails. Please try after some time or contact BPC Support - +1 892-627-7289",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//emailVerify is to verify the email
export const emailVerify = async function (req, res) {
  try {
    const userId = req.query.id;
    let message = "";
    // Scenario 1: ID is missing in the URL
    if (!userId) {
      message = "Invalid verification link";
      return res.status(400).render("resView", { message });
    }

    // Scenario 2: Check if ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      message = "Invalid user ID";
      return res.status(400).render("resView", { message });
    }

    // Scenario 3: Find user and update their verification status
    const user = await User.findById(userId);

    if (!user) {
      // Scenario 4: User not found in database
      message = "User not found";
      return res.status(404).render("resView", { message });
    }

    if (user.isVerified === 1) {
      // Scenario 5: User is already verified
      message = "Your email is already confirmed";
      return res.render("resView", { message });
    }

    // Update user status
    user.isVerified = 1;
    await user.save();
    message = "Thanks for verifying your mail-ID";
    // Scenario 6: Success - Send the actual HTML file
    res.render("resView", { message });
  } catch (error) {
    // Scenario 7: Server or Database error
    console.error(error);
    res
      .status(500)
      .send("<h1>Server Error</h1><p>Something went wrong on our end.</p>");
  }
};

export const forgotPassword = async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  const OTP = Math.floor(Math.random() * (999999 - 100001) + 100001);
  await ResetPassword.deleteOne({ email });
  await ResetPassword.create({ email, userID: user._id, OTP });
  const message = `<p>Use the OTP : ${OTP} to reset your password</p>`;
  const resEml = await sendMail(email, "User Reset Password", message);
  if (resEml instanceof Error) {
    let msg =
      "Due to unexpected issues, mail could not be sent. Please try after some time";
    res.status(500).render("resView", { message: msg });
  }
  let msg = "OTP successfully set to your email address to reset your password";
  res.status(200).render("resView", { message: msg });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  let message, user;
  try {
    user = await User.findOne({ email });
    message = `${req.path} - retrieved user object - ${JSON.stringify(user)}`;
  } catch (err) {
    res.json({ message: err.message });
  }
  
  log(message);
  if (user) {
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      res.json({ message: "Password is incorrect. Please try again" });
    }
    log("Login - Password Verified");
    const token = jwt.sign({userID:user._id,userEmail:user.email},process.env.SECRET);
    log(`Login - jwt token - ${token}`);

    res.status(200).json({message:"user logged in", token});
  } else {
    res.status(404).json({ message: "Account doesn't exist with this email" });
  }
};

export const deleteUser = async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.deleteOne({ email });
    res.json({ message: "User Deleted", user });
  } catch (err) {
    res.status(404).json({ message: "User not found. Unseccessul operation" });
  }
};


export async function protectedPath(req,res){
  res.status(200).json({message: "Protected Endpoint"});
}