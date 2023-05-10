const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);

  res.status(200).json({
    total,
    categorias,
  });
};

// obteneCatengoria - populate
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  if (!categoria.estado) {
    return res.status(404).json({
      msg: "La categoría no se encuentra en la DB",
    });
  }

  res.json({
    categoria,
  });
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: "La categoría ya existe",
    });
  }

  // generar la data a guardar

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  categoria.save();
  res.status(201).json({
    msg: "creado correctamente",
    categoria,
  });

  console.log(res);
};

// actualizarCategoria
actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id

  const nombreExiste = await Categoria.findOne({ nombre: data.nombre });

  if (nombreExiste) {
    if (!nombreExiste.estado) {
      const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre');
      res.status(200).json({
        categoria,
      });
    }
    if (nombreExiste.id !== id) {
      return res.status(400).json({
        msg: "El nombre de la categoría ya esta siendo usado",
      });
    } else {
      res.status(200).json({
        msg: "El nombre de la categoría es igual",
      });
    }
  }

  // validar si el nombre ya existe en la DB
  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre');

  res.json({
    msg: "actualizada correctamente!",
    categoria,
  });
};

// borrarCategoria - estado:false

const elimnarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoriaEliminada = await Categoria.findByIdAndUpdate(id, {estado: false,}, {new: true})
  res.json({
    msg: "eliminado",
    categoriaEliminada
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  elimnarCategoria,
};
