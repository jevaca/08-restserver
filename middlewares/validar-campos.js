const { validationResult } = require("express-validator");


const validarCampos = ( req, res, next ) => { //next es lo que llamo al final para que siga al siguiente middleware, si no hay más middleware retorna el control al controlador

    const errors = validationResult(req);
    if( !errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validarCampos
}