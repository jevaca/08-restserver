const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');


module.exports = {

    ...validarCampos, //para exportar todo lo que está dentro de validarCampos
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo

}