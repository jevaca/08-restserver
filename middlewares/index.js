const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {

    ...validarCampos, //para exportar todo lo que está dentro de validarCampos
    ...validarJWT,
    ...validaRoles

}