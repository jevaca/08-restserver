const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerProducto, obtenerProductos, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');


const { validarJWT, 
        validarCampos, 
        esAdminRole} = require('../middlewares');


const router = Router();

//obtener todas las categorías - publico
router.get('/', obtenerProductos);

//obtener un producto
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos,
] ,obtenerProducto);

//crear un producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    check('disponible', 'La disponibilidad del producto es obligatorio').not().isEmpty(),
    validarCampos,
] , crearProducto);

//actualizar un producto
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos,
] ,actualizarProducto);

//eliminar un producto
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos,
] , borrarProducto);

module.exports = router;