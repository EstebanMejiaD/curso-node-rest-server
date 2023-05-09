const { Router } = require("express");
const {
  obtenerUsuario,
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
} = require("../controllers/usuarios.controller");

const router = Router();
router.get("/", obtenerUsuario);

router.put("/:id", actualizarUsuario);

router.post("/", crearUsuario);

router.delete("/", eliminarUsuario);

module.exports = router;
