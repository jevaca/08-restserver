const { response, request } = require("express");
const Pedido = require("../models/pedido");


const obtenerPedidos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const [ total, pedidos  ] = await Promise.all([ 
        Pedido.countDocuments(),
        Pedido.find()
        .skip(Number(desde)) 
        .limit(Number(limite))
        .populate('productos.id', 'nombre')
        .populate('usuario', 'nombre')
    ]);

    res.json({
        total, 
        pedidos
    });

}

const crearPedido = async ( req = request, res = response ) => {

    const { usuario, ...body } = req.body;


    const data = {
        ...body,
        usuario: req.usuario._id

    }

    const pedido = await new Pedido(data);

    await pedido.save();

    res.json(pedido);

}

const actualizarPedido = async (req = request, res = response) => {
    
    const { id } = req.params;
    const data = req.body;

    const pedido = await Pedido.findByIdAndUpdate( id, data, {new: true});

    res.json(pedido);
}

module.exports = {
    obtenerPedidos,
    crearPedido,
    actualizarPedido
}