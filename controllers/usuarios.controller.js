const { response, request } = require("express")


const obtenerUsuario = (req = request, res = response)=> {
    
    const { q, nombre = "no name",  apikey} = req.query

    res.json({
        msg: "get API - controlador",
        q,
        nombre,
        apikey
    })
}

const crearUsuario = (req, res = response)=> {
   const body = req.body;
    res.json({
        msg: "dadsa",
        body
    })
}

const actualizarUsuario = (req, res = response)=> {
    
    const id = req.params.id

    res.json({
        msg: "put API - controlador",
        id
    })
}


const eliminarUsuario = (req, res = response)=> {
    
    res.json({
        msg: "delete API - controlador"
    })
}


module.exports = {
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}