const express = require("express");
const authrouter = express.Router();
const usermodel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendMail = require("../utils/sendmail");
const TokenValidity = require("../middlewares/tokenValidation");
const { generateToken } = require("../utils/jwt");

// METHOD:POST
// SIGNUP ROUTER TO CREATE A USER AND STORES IT IN DB WITH HASHING THE PASSWORD BEFORE SAVING

authrouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); //HASHING PASSWORD WITH BCRYPT
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new usermodel({
      name,
      email,
      password: hashedpassword,
    });

    await newUser.save(); //SAVING USER TO DB

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
  }
});

// METHOD:POST
// LOGIN ROUTER TO LOGIN A USER THAT PRESENTS IN DB WITH REGISTERED MAILID AND PASSWORD
authrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const passwordValid = await bcrypt.compare(password, user.password); //COMPARING THE ENTERED PASSWORD WITH PASSWORD IN DB

    if (!passwordValid) {
      res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: user._id, email: user.email }); //GENERATIING TOKEN ON SUCCESSFUL LOGIN USING JWT

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong", ERROR: error.message });
  }
});

// METHOD:POST
// ROUTER TO FORGOT PASSWORD PAGE WHERE USER ENTERS A MAIL ID TO GET PASSWORD RESET LINK

authrouter.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const matchedUser = await usermodel.findOne({ email });
    if (!matchedUser) {
      res.status(404).json({ message: "Email not found", success: false });
    } else {

      const resettoken = crypto.randomBytes(32).toString("hex");  //GENERATING RANDOM STRING USING CRYPTO
      matchedUser.resettoken = resettoken;                        //STORING RANDOM STRING IN DB FOR RESPECTIVE USER
      matchedUser.tokenexpiry = Date.now() + 3600000;             //STORING EXPIRY TIME FOR TOKEN IN DB
      await matchedUser.save();                                   //SAVING CHANGES IN DB

      const resetUrl = `https://pass-reset-flow-fe.netlify.app/resetpassword?token=${resettoken}`; //CREATING RESET LINK PASSING RESET TOKEN AS QUERY
      const subject = "Password reset link";                                  
      const html = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 1 hour.</p>`; 
      await sendMail(email, subject, html);  // SENDING MAIL FUNCTION FROM UTILS

      res.status(200).json({ message: "Password reset link sent to mail", success: true });

    }
  } catch (error) {

    res.status(400).json({ message: "Bad request", Error: error.message });

  }
});




// METHOD:GET
// ROUTE TO VALIDATE THE RESET TOKEN USING MIDDLEWARE

authrouter.get("/validateToken", TokenValidity, async (req, res) => {
  return res.status(200).json({ message: "Token is valid", success: true });
});




// METHOD:PATCH
// ROUTE TO  RESET THE PASSWORD AFTER VALIDATING IT WITH MIDDLEWARE AND HASHING THE PASSWORD AND UPDATES IT IN DB

authrouter.patch("/resetpassword", TokenValidity, async (req, res) => {
  
  const { password } = req.body;

  try {
    const fetchedUser = req.user;

    const hashedPwd = await bcrypt.hash(password, 12); //HASHING PASSWORD
    fetchedUser.password = hashedPwd;

    fetchedUser.resettoken = undefined;
    fetchedUser.tokenexpiry = undefined; // AFTER A SUCCESSFUL RESET CLEARING THE RESETTOKEN AND ITS EXPIRY TIME FROM DB

    await fetchedUser.save();  //SAVING UPDATED CHANGES IN DB

    return res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", Error: error.message });
  }
});

module.exports = authrouter;
