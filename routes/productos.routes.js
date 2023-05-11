const { Router } = require("express")
const {check} = require("express-validator")
const { obtenerProductos, crearProducto, obtenerProductoPorId, actualizarProducto, eliminarProductoPorId } = require("../controllers/productos.controller")
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares")
const { existeProductoPorId } = require("../helpers/db-validatos")



const router = Router()


router.get("/",[
    validarJWT,
    validarCampos
],obtenerProductos)

router.get("/:id",[
    check("id", "El id no es valido").isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProductoPorId)

router.post("/",[
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria y debe ser una uid').isMongoId(),
    validarCampos
], crearProducto)


router.put("/:id",[
    validarJWT,
    esAdminRole,
    check('id').custom( existeProductoPorId ),
    validarCampos
],actualizarProducto)


router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id').custom( existeProductoPorId ),
    validarCampos
],eliminarProductoPorId)



module.exports = router