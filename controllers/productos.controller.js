const { request, response, json } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({estado:true}),
    Producto.find({ estado: true })
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .limit(limite)
      .skip(desde),
  ]);

  res.json({
    status:200,
    total,
    productos,
  });
};

const obtenerProductoPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  if (!producto.estado) {
    res.status(404).json({
      msg: `El id del producto no existe: ${id}`,
    });
  }

  res.status(200).json({
    status:200,
    producto,
  });
};

const crearProducto = async (req = request, res = response) => {
  const { estado, nombre, ...rest } = req.body;

  const existeProductoDB = await Producto.findOne({ nombre });

  if (existeProductoDB) {
   return res.status(400).json({
        status: 400,
      msg: "El producto ya existe",
    });
  }

  const data = {
    nombre,
    ...rest,
    usuario: req.usuario._id,
  };

  const producto = await new Producto(data);
  await producto.save();
  res.status(201).json({
    status: 201,
    msg: "Producto creado",
    producto,
  });
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;
  const nombreExiste = await Producto.findOne({ nombre: data.nombre });

  if (nombreExiste) {
    if (!nombreExiste.estado) {
      const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
        .populate("usuario", "nombre")
        .populate("categoria", "nombre");

      res.status(200).json({
        status: 200,
        msg: "El producto ha sido actualizado",
        producto,
      });
    }
    if (nombreExiste.id !== id) {
      res.status(400).json({
        status: 400,
        msg: "El nombre del producto ya esta siendo usado",
      });
    }
  }

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(200).json({
    status: 200,
    msg: "El producto ha sido actualizado",
    producto,
  });
};

const eliminarProductoPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  ).populate("usuario", 'nombre').populate('categoria', 'nombre')

  res.json({
    status: 200,
    msg: "Eliminado correctamente",
    producto,
  });
};

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProductoPorId,
};
