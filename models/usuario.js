const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] //el primer indica si es requerido, y el segundo el error que se mostrará si el nombre no es enviado
    },

    correo: {
        type: String,
        required: [true, 'El correo es Obligatorio'],
        unique: true
    },
    
    password: {
        type: String,
        required: [true, 'La contraseña es Obligatoria'],
        unique: true
    },
    
    img: {
        type: String,
    },
    
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'] //solo permito dos valores para este campo
    },
    
    estado: {
        type: Boolean,
        default: true,
    },

    google: {
        type: Boolean,
        default: false
    }
    
});

//ocultamos la password y el __v para que no se muestren al ejecutar un POST
UsuarioSchema.methods.toJSON = function() { //tiene que ser una funcion normal para emplear el this
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema ); //nombre de la colección, por defecto Mongoose le agrega una "s" por lo que el nombre se coloca en singular
