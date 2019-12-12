const express = require('express'),
  app = express(),
  cors = require('cors'),
  bodyParser = require('body-parser');
  port = process.env.PORT || 3000;


const mysql = require('mysql');
// connection configurations
const publicDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
});
 
// connect to public database
publicDB.connect();

// connection configurations
const privateDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myPrivateDB'
});
 
// connect to public database
privateDB.connect();

app.listen(port);

console.log('API server started on: ' + port);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var publicRoutes = require('./app/routes/public'); //importing route
publicRoutes(app); //register the route

var privateRoutes = require('./app/routes/private'); //importing route
privateRoutes(app); //register the route

