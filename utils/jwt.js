const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
SECRET_KEY = process.env.SECRET_KEY;


const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
    
}


const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY)
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}


module.exports = {
    generateToken,
    verifyToken
}