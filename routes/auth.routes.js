const { Router } = require("express");
const { check } = require("express-validator");


const { login, googleSingIn } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/login",[
    check("correo", "el correo es obligatorio").isEmail(),
    check("password", "el password es obligatorio").not().isEmpty(),
    validarCampos
] ,login);

router.post("/google",[
    check("id_token", "El id token es necesario").not().isEmpty(),
    validarCampos
] ,googleSingIn);

module.exports = router
