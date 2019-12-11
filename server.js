var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//create functionality for both public and private dbs

//SQL functionality
// Id - autoiincrememt
// Coordinates - JSON - not null - CANNOT HAVE DEFAULT
	// https://dev.mysql.com/doc/refman/8.0/en/json.html
//  author - text - not null default ""
// Location - text - not null default ""
// Distance - REAL - not null default 0.0
// Elevation - REAL - not null - default 0.0
// Favorites - JSON - not null - CANNOT HAVE DEFAULT
		// https://dev.mysql.com/doc/refman/8.0/en/json.html 
		//count would be length of array

// EX Insert Statement for public
// INSERT INTO `routes`.`publicroutes`
// (`Coordinates`,
// `Author`,
// `Location`,
// `Distance`,
// `Elevation`,
// `Favorites`)
// VALUES
// ('{"key1": "[40.0, 30.0]", "key2": "[20.0, 30.0]"}',
// 'test pub user',
// 'test public location',
// 0.0,
// 0.0,
// '{"key1": "test pub user 1", "key2": "test pub user 2"}');

// Node server.js

//debouncing 
// https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086


//START
// * Mysql server
// * run node server.js

//Define db to be a connection
var public_connection = mysql.createConnection({
	host     : 'localhost',
	port 	 : '3306',
	user     : 'root',
	password : 'password12345',
  	database : 'routes'
});

var private_connection = mysql.createConnection({
	host     : 'localhost',
	port 	 : '3306',
	user     : 'root',
	password : 'password12345',
  	database : 'privateroutes'
});

public_connection.query('SELECT `publicroutes`.`id`,`publicroutes`.`Coordinates`,`publicroutes`.`Author`,`publicroutes`.`Location`,`publicroutes`.`Distance`,`publicroutes`.`Elevation`,`publicroutes`.`Favorites` FROM `routes`.`publicroutes` WHERE `id`=1;', function(error, results, fields) {
	if (results) {
		// request.session.loggedin = true;
		// request.session.username = username;
		console.log(results)
	} else {
		// response.send('Incorrect Username and/or Password!');
		console.log("Error")
	}			
	// response.end();
	console.log("end")
});

//Creates session secret
app.use(session({
	secret: 'cd46791d1178e603cae28c059876900e831d147f2e7944b57f7a4e652de74fc8',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Display the login.html file
// app.get('/', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/index.html'));
// });

//Connect to mysql db
// app.post('/auth', function(request, response) {
// 	var distance = request.body.distance;
// 	var elevation = request.body.elevation;
// 	var author = request.body.author;

//   if (username && password) {
// 		connection.query('SELECT users.* FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			if (results) {
// 				request.session.loggedin = true;
// 				request.session.username = username;
// 				response.redirect('/home');
// 			} else {
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// });

//logs in user
// app.get('/home', function(request, response) {
// 	if (request.session.loggedin) {
// 		console.log(request.session);
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		response.send('Please login to view this page!');
// 	}
//   response.end();
// });

//listen on port 3000
app.listen(3000);


//Taken from https://codeshack.io/basic-login-system-nodejs-express-mysql/
