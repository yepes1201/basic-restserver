require("dotenv").config();
const cors = require("cors");
const express = require("express");
const router = require("../routes/users");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userRoute = "/api/users";

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
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
    this.app.use(this.userRoute, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log("Server running on port", this.port)
    );
  }
}

module.exports = Server;
