const { response, request } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types
const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = '', res = response)=>{

    const esMongoID = ObjectId.isValid( termino )

    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({ 
        $or:  [{nombre: regex }, {correo: regex} ],
        $and: [{estado:true}]
    })

    return res.json({
        results: usuarios
    })
}

const buscarCategoria =  async(termino = '', res =response) => {
    const esMongoID = ObjectId.isValid( termino )

    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const expresion = new RegExp(termino, 'i')

    const categorias = await Categoria.find({nombre: expresion, estado: true})

    return res.json({
        results: categorias
    })

}
const buscarProducto =  async(termino = '', res =response) => {
    const esMongoID = ObjectId.isValid( termino )

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const expresion = new RegExp(termino, 'i')

    const producto = await Producto.find({nombre: expresion, estado: true}).populate('categoria', 'nombre')

    return res.json({
        results: producto
    })

}

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
        buscarUsuarios(termino, res)
      break;
    case "categorias":
        buscarCategoria(termino, res)
      break;
    case "productos":
        buscarProducto(termino, res)
      break;
    default:
      res.status(500).json({
        msg: "Se me olvidó hacer esta búsqueda",
      });
  }

  
};

module.exports = {
  buscar,
};
