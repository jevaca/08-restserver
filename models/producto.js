const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { 
        type: Schema.Types.ObjectId, //decimos que va a tener asociado otro esquema
        ref: 'Usuario', //el nombre del esquema que debe ser el mismo que especificamos al exportar el modelo del producto (model('Producto'), CategoriaSchema)
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },


});


ProductoSchema.methods.toJSON = function() { //tiene que ser una funcion normal para emplear el this
    const { __v, estado, ...categoria } = this.toObject();
    return categoria;
}

module.exports = model('Producto', ProductoSchema);