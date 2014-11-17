require('colors')
var port = 10003;

/*
development = true
if(process.argv[2] == 'dev'){
  port = port
  development = development
}else if(process.argv[2] == 'production'){
 port = 10001
 development = false
}else{
 console.log("ARGUMENT NEEDED".red,"\n - ","FOR DEVELOPMENT LAUNCH:".cyan,"node engine.js dev","\n - ","FOR PRODUCTION LAUNCH:".yellow,"node engine.js production")
 process.exit()
}*/

var express = require('express')
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http');

var UAParser = require('ua-parser-js');

var sys = require('sys');
_ = require('lodash')

app.use('/', express.static(__dirname + '/public'));
app.use(express.bodyParser())

app.listen(port);
console.log('listening @ '+port);