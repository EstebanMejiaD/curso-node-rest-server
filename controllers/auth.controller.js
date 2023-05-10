const { response, request } = require("express");
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const login =async (req= request, res = response) => {

    try {

        const { correo, password } = req.body

        // verificar si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msj: 'Usuario / password no son correctos'
            })
        }
        // si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msj: 'Usuario / password no son correctos, estado: false'
            })
        }
        // verificacion de la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msj: 'Usuario / password no son correctos, password'
            })
        }

        // generar JWT
        const token = await generarJWT( usuario.id )



        res.json({
            msg: "inicio de sesion",
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
         res.status(500).json({
            msg: 'hable con el administrador, algo salió mal'
        })
    }

   

}



module.exports = {
    login
}