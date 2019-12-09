var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//create functionality for both public and private dbs

//SQL functionality
// Id - autoiincrememt
// Coordinates - 2d array
//  user - text - not null default ""
// Location - text - not null default ""
// Distance - double - not null default 0.0
// Elevation - double - not null - default 0.0
// Favorites - int - default 0 - not null
// isPrivate - boolean default false - not null

// Node server.js



//Define db to be a connection
var connection = mysql.createConnection({
	host     : 'localhost',
	port 	 : '3306',
	user     : 'root',
	password : '',
  	database : 'login'
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
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

//Connect to mysql db
app.post('/auth', function(request, response) {
	var username = request.body.username;
	  var password = request.body.password;

  if (username && password) {
		connection.query('SELECT users.* FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//logs in user
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		console.log(request.session);
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
  response.end();
});

//listen on port 3000
app.listen(3000);


//Taken from https://codeshack.io/basic-login-system-nodejs-express-mysql/
