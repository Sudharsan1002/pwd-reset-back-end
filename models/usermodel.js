const mongoose = require("mongoose")


//SCHEMA
const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required:true
    },

    password: {
        type: String,
        required:true
    },
    resettoken: {
        type:String
    },
    tokenexpiry: {
        type:Date
    }
}, { timestamps: true })



module.exports = mongoose.model("users", Userschema)
