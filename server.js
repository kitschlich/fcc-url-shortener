'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;

var app = express();

mongo.connect('mongodb://localhost:27017/urlshortener', function (err, db) {
  if (err) throw new Error('Databae failed to connect!');
  else console.log('MongoDB successfully connected on port 27017.');
  
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
  
  routes(app, db);
});

app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + process.env.PORT + '...');
});