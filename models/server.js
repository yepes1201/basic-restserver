require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = "/api/users";
    this.authPath = "/api/auth";

    // DB Connection
    this.connectDb();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDb() {
    await dbConnection();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Reading and parsing from body
    this.app.use(express.json());

    // Public Directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.userPath, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log("Server running on port", this.port)
    );
  }
}

module.exports = Server;
