const usermodel = require("../models/usermodel");

const TokenValidity = async (req, res, next) => {
  const token = req.query.token || req.body.token;

  if (!token) {
    return res.status(400).json({ message: "Token id required" });
  }
  try {
    const foundedUser = await usermodel.findOne({
      resettoken: token,
      tokenexpiry: { $gt: Date.now() },
    });

    if (!foundedUser) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    req.user = foundedUser;
    next();
    // return res.status(200).json({ message: "Token is valid", success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Token validation failed", Error: err.message });
  }
};

module.exports = TokenValidity;
