const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleecionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
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


const buscar = ( req, res = response) => {

    const { coleccion, termino } = req.params;

    if( !coleecionesPermitidas.includes( coleccion ) ){
        return res.status(400).status({
            msg: `Las colecciones permitidas son: ${ coleecionesPermitidas }`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuario( termino, res );
        break;
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
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