const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async ( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async ( correo = '' ) => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        //return res.status(400).json({
        //    msg: `El correo ${correo} ya está registrado`
        //})
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async ( id = '' ) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
}

const existeCategoria = async ( id = '' ) => {
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error(`La categoría con el id: ${id} no existe`);
    }
}

const existeProducto = async( id = '' ) => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error(`El producto con el id ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}