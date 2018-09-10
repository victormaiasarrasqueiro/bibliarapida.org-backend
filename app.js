const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');

var app = express();

// Importando configurações comuns do sistema.
var common_configuration = require('./app/comum/config/configuration');

// Importando configurações comuns do sistema.
var carga = require('./app/comum/carga');

//Service Mapper
var serviceMapper = require('./app/service/routeMapperService');

// Definindo o diretorio da camada de visao e a engine de template.
//app.set('views', path.join(__dirname, 'app/view/dynamic'));
//app.set('view engine', 'ejs');

const corsOptions = {
    origin: ['http://bibliarapida.s3-website-sa-east-1.amazonaws.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(express.static('public'));

// Configurando Servicos para a aplicacao
serviceMapper(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function() {
    console.log("Servidor: OK ( Rodando na porta: " + app.get('port') + " )");
    console.log('Iniciando Processo de carga');

    //carga.carga();

});


module.exports = app;