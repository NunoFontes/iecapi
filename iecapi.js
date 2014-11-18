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

SQL_AUTH_KEY = require('./config/sql_auth.js')
MONGO_AUTH_KEY = require('./config/mongo_auth.js')

var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var path = require('path')
var fs = require('fs')
http = require('http')

var sys = require('sys')
_ = require('lodash')

local_database = 0
var MongoClient = require('mongodb').MongoClient
MongoClient.connect(MONGO_AUTH_KEY.host+':'+MONGO_AUTH_KEY.port+'/'+MONGO_AUTH_KEY.db, function(err, db) {
 local_database = db
})

console.log(SQL_AUTH_KEY)

worker = require('./fn/little-helper.js')
//scientist = require('./fn/scientist.js')

scientist = require('./fn/temp_scientist.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(__dirname + '/public'))

///// FORECASTS
app.get('/fs',function(req,res){
	var pairs = req.query.ids || "portugal:gdp"
	worker.getForecastsFromTE(pairs,function(raw_forecasts){
		scientist.forecastify(raw_forecasts,function(forecasts){
			res.send(forecasts)
		})
	})
})

//// GEOMAP
app.get('/geo',function(req,res){
	if(!local_database) return res.send('try later')
	var group = req.query.g || "caribbean"
	var indicator = req.query.i || "gdp"
 worker.countriesInGroup(group,function(list_of_countries){
  worker.getLatestFromTE(list_of_countries,'gdp',{},function(latest_data){
  	scientist.geoMapify(latest_data,function(geomap){
  		res.send(geomap)
  	})
  })
 })
})

app.listen(port);
console.log('listening @ '+port);