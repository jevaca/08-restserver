const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto, Pedido } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
    'pedidos',
];

const buscarUsuario = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        //const usuario = await Usuario.findById( termino );
        const usuario = await Usuario.find({
            $and: [{_id: termino}, {estado: true}]
        });
        
        return res.json( {
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); //hacemos que sea insensible a las minusculas y mayusculas con expresiones regulares

    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }], //indicamos a mongo cn $or que matchee con uno o con otro
        $and: [{ estado: true }]
     });
    
    res.json( {
        results: usuarios
    })

}

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        
        return res.json( {
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); //hacemos que sea insensible a las minusculas y mayusculas con expresiones regulares

    const categorias = await Categoria.find({ nombre: regex, estado: true});
    
    res.json( {
        results: categorias
    })

}

const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const producto = await Producto.findById( termino )
            .populate('categoria', 'nombre');
        
        return res.json( {
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); //hacemos que sea insensible a las minusculas y mayusculas con expresiones regulares

    const producto = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');;
    
    res.json( {
        results: producto
    })

}


const buscarPedidos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {

        const [ total, pedidos  ] = await Promise.all([ 
                Pedido.find( { usuario: termino } ).countDocuments(),
                Pedido.find( { usuario: termino } )
                .populate('productos.producto', 'nombre')
                .populate('usuario', 'nombre')
            ]);    
        
        return res.json( {
            total,
            results: ( pedidos ) ? [ pedidos ] : []
        })
    }

    // const regex = new RegExp( termino, 'i' ); //hacemos que sea insensible a las minusculas y mayusculas con expresiones regulares

    // const producto = await Producto.find({ nombre: regex, estado: true })
    //     .populate('categoria', 'nombre');;
    
    // res.json( {
    //     results: producto
    // })

}


const buscar = ( req, res = response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).status({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch( coleccion ){
        case 'usuarios':
            buscarUsuario( termino, res );
        break;
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        case 'pedidos':
            buscarPedidos( termino, res );
        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
        
    }

}



module.exports = {
    buscar
}