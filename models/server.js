const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/usuarios';

        //Conectar a base de datos
        this.conctarDB();

        //Middlewares funciones que agregan funcionalidad al webserver
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    middlewares(){
        //cors para restringir la url desde la que se puede llamar a la pai
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json() ); //indicamos que cualquier información que viaje en el body se debe serializar a json
        
        //Directorio publico
        this.app.use( express.static('public') );

    }

    routes(){

        //middleware donde especificamos la ruta para llamar a la API desde el cliente y con require las peticiones que utilizará
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios'));

        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto:${this.port}`);
        });
    }

    async conctarDB(){
        await dbConnection();
    }

}


module.exports = Server;