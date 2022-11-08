var express = require('express');
// , logger = require('morgan');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
// var http = require('http');
var app = express();

// function cors(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', "*");
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, AUTH');

// 	next();
// };

global.base = __dirname;
// app.use(cors);
app.use("/", express.static(__dirname + "/dist"));

app.listen(port);
console.log("Started on port", port);