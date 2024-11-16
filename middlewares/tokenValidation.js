const usermodel = require("../models/usermodel");

//MIDDLEWARE FUNCTION TO VALIDATE RFEST TOKEN

const TokenValidity = async (req, res, next) => {
  const token = req.query.token || req.body.token;

  if (!token) {
    return res.status(400).json({ message: "Token id required" });
  }
  try {
    const foundedUser = await usermodel.findOne({
      resettoken: token,
      tokenexpiry: { $gt: Date.now() },                   //VERIFYING WHETHER THE USER HAS A VALID TOKEN OR NOT
    });

    if (!foundedUser) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    req.user = foundedUser;        //STORING FOUNDED USER  AS REQUESTED USER
    next();
    
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Token validation failed", Error: err.message });
  }
};

module.exports = TokenValidity;
