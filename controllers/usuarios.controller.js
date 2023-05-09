const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const obtenerUsuario = async (req = request, res = response) => {
  const body = req.body;

  console.log(usuario);
  res.json({
    msg: "get API - controlador",
    body,
  });
};

const crearUsuario = async (req, res = response) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en db
    await usuario.save();
    res.json({
      msg: "Usuario creado correctamente!",
      usuario,
      codeStatus: 201,
    });
  } catch (error) {
    console.log(error);
  }
};

const actualizarUsuario = async(req=request, res = response) => {
  const { id } = req.params
    const {_id, password, google, correo,...rest } = req.body
    // TODO valordar contra base de datos

    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id,  rest )



  res.json({
    msg: "put API - controlador",
    usuario
  });
};

const eliminarUsuario = (req, res = response) => {
  res.json({
    msg: "delete API - controlador",
  });
};

module.exports = {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
