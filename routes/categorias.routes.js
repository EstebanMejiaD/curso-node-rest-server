const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  tieneRole,
} = require("../middlewares/index");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  elimnarCategoria,
} = require("../controllers/categorias.controller");
const { existeCategoriaPorId } = require("../helpers/db-validatos");

const router = Router();

/**
 * {{url}}/api/categoria - publico
 */
//obtener todas las categorías
router.get("/", obtenerCategorias);

//obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);
//crear categoria -privada - cualpersona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
//actualizar un registro por id - privada - cualpersona con un token valido
router.put("/:id",[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,actualizarCategoria);

//eliminar una categoría - admin
router.delete("/:id",[
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],elimnarCategoria);

module.exports = router;
