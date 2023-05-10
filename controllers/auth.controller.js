const { response, request, json } = require("express");
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
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



const googleSingIn = async (req=request, res=response)=> {
    const {id_token} = req.body;
    try {

        const {nombre, img, correo} = await googleVerify(id_token)



       let usuario = await Usuario.findOne({correo})
    
       
       if (usuario === null) {
            //crearlo
            const data = {
                nombre,
                correo,
                img,
                password: ':P',
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario( data )
            await usuario.save()

       }

       //si el usuario en DB
       if (!usuario.estado) {
        return res.status(401).json({
            msg: 'Hable con el administrado, usuario bloqueado!'
        })
       }
       // generar el jwt
       const token = await generarJWT( usuario.id )
       

       return res.json({
            usuario,
            token
        })
        
    } catch (error) {
       return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}


module.exports = {
    login,
    googleSingIn
}