const { response, request } = require("express");
const path = require("path");
const fs = require("fs");

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const claudinary = require("cloudinary").v2
claudinary.config(process.env.CLOUDINARY_URL)

const cargarArchivos = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json({
      msg,
    });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: " Se le olvidó validar ésto",
      });
  }

  // limpiar imagenes previas

  if (modelo.img) {
    // hey que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json({
    modelo,
  });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        const pathNotFoundImage = path.join(__dirname, '../assets/no-image.jpg')

        return res.sendFile(pathNotFoundImage)
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        const pathNotFoundImage = path.join(__dirname, '../assets/no-image.jpg')

        return res.sendFile(pathNotFoundImage)
      }
      break;

    default:
      return res.status(500).json({
        msg: " Se le olvidó validar ésto",
      });
  }

  // limpiar imagenes previas

  if (modelo.img) {
    // hey que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }

    const pathNotFoundImage = path.join(__dirname, '../assets/no-image.jpg')

    res.sendFile(pathNotFoundImage)
  }

  
};


const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: " Se le olvidó validar ésto",
      });
  }

  // limpiar imagenes previas

  if (modelo.img) {
    // hey que borrar la imagen del servidor
   //todo
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr[nombreArr.length-1]
    const [ public_id ] = nombre.split('.')
    
    claudinary.uploader.destroy(public_id)
  }

const {tempFilePath} = req.files.archivo
  const {secure_url} = await claudinary.uploader.upload( tempFilePath )


  
  modelo.img = secure_url;

  await modelo.save();

  res.json({
    modelo
  });
};

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
