
const { Categoria, Usuario, Role } = require("../models");


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

  const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
      throw new Error(`El id de la categoría no existe: ${id}`)
    }
  }




module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId
}