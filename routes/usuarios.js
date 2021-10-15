const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const Role = require('../models/role');

const router = Router();

/*
    GET: obtener data
    POST: crear nuevos recursos (crea usuario por ejemplo)
    PUT: actualizar data
    DELETE: eliminar data
*/

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ), 
    validarCampos,
], usuariosPut); //por ejemplo si quiero que el usuario me especifique un id api/usuario/10

router.post('/',[ //enviamos los middelwares como un array (si coloco más de uno), siempre van en el segundo parámetro, mientras que en el tercero se encuentran el controlador
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //el primer argumento es la propiedad que queremos evaluar y el segundo el mensaje que se mostrará en caso de error
    check('password', 'El password debe ser de más de 6 letras').isLength({min: 6}), 
    check('correo', 'El correo no es válido').isEmail(), 
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ), //custo para indicar que es una validacion personalizada
    check('correo').custom( emailExiste ),
    validarCampos //para tirar un error y no seguir ejecutando la petición
] ,usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;



