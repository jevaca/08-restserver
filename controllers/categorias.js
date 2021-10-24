const { response } = require("express");

const { Categoria } = require('../models');

//obtenerCategorias, debe ser paginado y verse el total. Vamos a llamar un método llamado populate

const obtenerCategorias = async (req = request, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    const query = {estado: true};


    const [ total, categoria  ] = await Promise.all([ 
        Categoria.countDocuments(query),
        Categoria.find(query) 
        .skip(Number(desde)) 
        .limit(Number(limite))
        .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categoria
    }); 


}

//obtener Categoria - populate{}
const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await  Categoria.findById(id) 
        .populate('usuario', 'nombre');

    res.json({
        categoria
    }); 

}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria( data );
    
    //Guardar en DB
    await categoria.save();
    
    res.status(201).json(categoria);

}


//actualizarCategoría, solamente cambiar el nombre
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const nombre = data.nombre;

    const categoriaDB = await Categoria.findOne( {nombre} );

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );  //el tercer parámetro es para que me regrese siempre el valor actualizado
    
    res.status(200).json(categoria); //para retornar un objeto json

}

//borrarCategoria, se debe cambiar el estado a false
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } ); 
    
    res.status(200).json(categoria); //para retornar un objeto json
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}