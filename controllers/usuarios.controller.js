const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const obtenerUsuarios = async (req = request, res = response) => {
  
  const { limite = 5, desde = 0 } = req.query
  const query = {estado: true}
  // const usuarios = await Usuario.find(query)
  //     .skip(Number(desde))
  //     .limit(Number(limite))
  // const total = await Usuario.countDocuments(query)

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite))
])

  res.json({
    total,
    usuarios
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



  res.json(usuario);
};

const eliminarUsuario = async (req= request, res = response) => {

  const { id } = req.params 


  //fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete( id )


  //  virtualmente lo borra cambiando el estdo 
  const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} )

   res.json({
    usuario
  });
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
