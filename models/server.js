const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:                '/api/auth',
            buscar:              '/api/buscar',
            categorias:          '/api/categorias',
            usuarios:            '/api/usuarios',
            productos:           '/api/productos',
            uploads:             '/api/uploads',
            pedidos:             '/api/pedidos',
        }

        //this.usuariosRoutePath = '/api/usuarios';
        //this.authPath = '/api/auth';

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

        //Fileupload
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true,
        }));

    }

    routes(){

        //middleware donde especificamos la ruta para llamar a la API desde el cliente y con require las peticiones que utilizará
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.pedidos, require('../routes/pedidos'));
        
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