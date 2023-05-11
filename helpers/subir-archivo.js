const path = require("path")
const { v4: uuidv4 } = require("uuid")

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");

    console.log(nombreCortado);

    const extencion = nombreCortado[nombreCortado.length - 1];

    //  Validar la extencion
    

    if (!extensionesValidas.includes(extencion)) {
        return reject(`La extención ${extencion} no es permitida: las permitidas son:  ${extensionesValidas}`)
      
    }

    const nombreTemp = uuidv4() + "." + extencion;

    uploadPath = path.join(__dirname, "../uploads/",carpeta,nombreTemp);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        return reject(err)
      }

      resolve( nombreTemp )
    });
  });
};

module.exports = {
    subirArchivo
};
