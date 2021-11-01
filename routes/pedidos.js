const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerPedidos, crearPedido, actualizarPedido } = require('../controllers/pedidos');

const { existePedido } = require('../helpers/db-validators');


const { validarJWT, 
        validarCampos, 
        esAdminRole} = require('../middlewares');


const router = Router();

//obtener todos los pedidos
router.get('/', obtenerPedidos);

//crear un pedido
router.post('/', [
    validarJWT,
    check('total', 'El precio total del pedido es obligatorio').not().isEmpty(),
    check('estado', 'El estado del pedido es obligatorio').not().isEmpty(),
    validarCampos,
] , crearPedido);

//actualizar pedido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePedido ),
    validarCampos,
] , actualizarPedido);

module.exports = router;