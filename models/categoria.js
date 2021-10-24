const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    usuario: { //usuario que creó la categoría
        type: Schema.Types.ObjectId, //decimos que va a tener asociado otro esquema
        ref: 'Usuario', //el nombre del esquema que debe ser el mismo que especificamos al exportar el modelo del usuario (model('Usuario'), CategoriaSchema)
        required: true
    }

});


CategoriaSchema.methods.toJSON = function() { //tiene que ser una funcion normal para emplear el this
    const { __v, estado, ...categoria } = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);