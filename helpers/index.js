const dbValidator = require("./db-validatos")
const generarJWT = require("./generar-jwt")
const googleVerify = require("./google-verify")
const subirArchivo = require("./subir-archivo")


module.exports = {
    ...dbValidator, 
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}