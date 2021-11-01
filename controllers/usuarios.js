const { response, request } = require('express'); //es redundante pero sirve para que vs studio code sepa el tipo del ebjeto response
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async (req = request, res = response) => {

    // const { nombre, edad, apikey = 'no apikey' } = req.query; //para obetener los query params (los atributos de la url) por ejemplo api/usuarios?nombre=jonathan&edad=26&dni=38792947
    
    const {limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find(query) //traigo todos los usuario cuyo estado estén en true, en caso de que quiera todos por igual no envío ningun argumento
    //     .skip(Number(desde)) //skip para empeza desde la posición que paso como argumento, se coloca en number para castearlo
    //     .limit(Number(limite)); //muestro solo la cantidad especificada

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios  ] = await Promise.all([ //debido a que tengo dos promesas que no dependen una de la otra (ver comentario de arriba) puedo utilizar un Promise.all para optimizar codigo
        Usuario.countDocuments(query),
        Usuario.find(query) //traigo todos los usuario cuyo estado estén en true, en caso de que quiera todos por igual no envío ningun argumento
        .skip(Number(desde)) //skip para empeza desde la posición que paso como argumento, se coloca en number para castearlo
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    }); //para retornar un objeto json

};

const usuariosPost = async (req, res) => {



    const { nombre, correo, password, rol } = req.body; //obtenemos el body de la request. Desestructuro el body con los parametros que necesito para asi ignorar cualquier otra cosa que el usuario me enviwe
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync(); //numero de vueltas para encriptar la contraseña, entre más vueltas mejor y más seguro pero tarda más. Se recomienda 10 que es el por defecto, pero podriamos pasar un 100 como argumento
    usuario.password = bcryptjs.hashSync(password, salt); //encriptamos

    //Guardar en BD
    await usuario.save();


    res.json({
        msg: 'post API - controlador',
        usuario
    }); //para retornar un objeto json
};

const usuariosPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body; //separamos los parametros del body para no modificar el id, el password (este se modifica a partir de la linea 48) y google.

    //TODO validar contra base de datos

    if (password) {

        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } ); //alcualizamos el usuario con el id del primer argumento, en el segundo especificamos las propiedas a modificar y sus valores

        res.json({usuario}); //para retornar un objeto json
};

const usuariosPatch = (req, res) => {

    res.json({
        msg: 'patch API - controlador'
    }); //para retornar un objeto json
};

const usuariosDelete = async (req, res) => {
    
    const { id } = req.params;
    
    //Lo borramos físicamente
    // const usuario = await Usuario.findByIdAndDelete( id ); //ya no se acostumbra borrar usuarios, sino deshabilitarlos

    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});
    //const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        //usuarioAutenticado
    }); //para retornar un objeto json
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}