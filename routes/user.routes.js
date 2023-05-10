const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  tieneRole,
  validarJWT,
  esAdminRole,
} = require("../middlewares/index");

const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validatos");

const {
  obtenerUsuarios,
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
} = require("../controllers/usuarios.controller");

const router = Router();
router.get("/", obtenerUsuarios);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  actualizarUsuario
);

router.post(
  "/",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("password", "el password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "el correo no es valido").isEmail(),
    check("correo").custom(existeEmail),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  crearUsuario
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  eliminarUsuario
);

module.exports = router;
