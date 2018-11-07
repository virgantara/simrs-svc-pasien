const config = require('config');
var appConfig = config.get('Simrs.appConfig');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
  port = process.env.PORT || appConfig.port;

var todoList = require('./app/controller/appController.js');


app.listen(port);

console.log('Service 3 Pasien started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route