
const Role = require("../models/role")
const Usuario = require("../models/usuario");


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
      throw new Error(`El rol ${rol} no existe en la DB`)
    }
  }


  const existeEmail = async (correo= '') => {
  
    const isCorreo = await Usuario.findOne({ correo });
  
    if (isCorreo) {
        throw new Error("El correo ya está registrado")
    } 
  
  };


  const existeUsuarioPorId = async (id)=> {

    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
      throw new Error(`El id no existe: ${id}`)
    }

  }



module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}