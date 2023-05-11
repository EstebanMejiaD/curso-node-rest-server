const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads.controller");
const { coleccionesPermitidas } = require("../helpers");
const { validarArchivoSubir } = require("../middlewares");

const router = Router();

router.post("/", [validarArchivoSubir, validarCampos], cargarArchivos);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
//   actualizarImagen
);

router.get("/:coleccion/:id", [
  check("id", "El id debe ser de mongo").isMongoId(),
  check("coleccion").custom((c) =>
    coleccionesPermitidas(c, ["usuarios", "productos"])
  ),
  validarCampos,
], mostrarImagen);

module.exports = router;
