const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarJWT, 
        validarCampos, 
        esAdminRole} = require('../middlewares');


const router = Router();

//obtener todas las categorías - publico
router.get('/', obtenerCategorias);

// obtener una categoria por id
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
] , obtenerCategoria); 

//crear categoria, privado con cualquier rol
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria);

//actualizar por id, privado con cualquier rol
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
] , actualizarCategoria );

//borrar categoria - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria );


module.exports = router;