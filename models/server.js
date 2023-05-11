const express = require("express");
const cors = require("cors");
const { dbConection } = require("../db/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      buscar: '/api/buscar',
      uploads: '/api/uploads'
    };
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

    // fileupload - carga de archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.usuarios, require("../routes/user.routes"));
    this.app.use(this.paths.categorias, require("../routes/categorias.routes"));
    this.app.use(this.paths.productos, require("../routes/productos.routes"));
    this.app.use(this.paths.buscar, require("../routes/buscar.routes"));
    this.app.use(this.paths.uploads, require("../routes/uploads.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("server active on port", this.port);
    });
  }
}

module.exports = Server;
