const express = require("express");
const dotenv = require("dotenv");
const { createDBConnection } = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const authrouter = require("./controllers/authcontroller");


// CONFIGURING .ENV FILE TO USE VALUES STORED IN IT
dotenv.config();

//CREATING SERVER USING EXPRESS
const server = express();


//USING CORS
server.use(cors());


//PARSING REQUESTS FROM BODY USING BODY PARSER
server.use(bodyParser.json());


//INJECTING ROUTES
server.use("/auth", authrouter);


//CALLING DATABASE CONNECTING FUNCTION
createDBConnection();


//LISTENING TO ROUTER
server.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log("Server started");
});
