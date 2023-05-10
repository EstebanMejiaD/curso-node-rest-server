const express = require("express");
const cors = require("cors");
const { dbConection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";

    //conectar a la base de datos
    this.conectarDB();
    // Middlewares
    this.middlewares();

    //rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConection();
  }

  middlewares() {
    //cors
    this.app.use(cors());

    // parseo y lectura del body
    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth.routes"))
    this.app.use(this.usuariosPath, require("../routes/user.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("server active on port", this.port);
    });
  }
}

module.exports = Server;
