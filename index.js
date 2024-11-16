const express = require("express");
const dotenv = require("dotenv");
const { createDBConnection } = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const authrouter = require("./controllers/authcontroller");

dotenv.config();

const server = express();

server.use(cors());

server.use(bodyParser.json());

server.use("/auth", authrouter);

createDBConnection();

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log("Server started");
});
