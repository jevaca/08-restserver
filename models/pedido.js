const { Schema, model } = require('mongoose');

const PedidoSchema = Schema({
    usuario: { 
        type: Schema.Types.ObjectId, //decimos que va a tener asociado otro esquema
        ref: 'Usuario', //el nombre del esquema que debe ser el mismo que especificamos al exportar el modelo del producto (model('Producto'), CategoriaSchema)
        required: true
    },
    productos: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
        },
        cantidad: {
            type: Number,
            default: 1
        },
        talle: {
            type: String,
        },
    }],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        required: true
    },

});


module.exports = model('Pedido', PedidoSchema);