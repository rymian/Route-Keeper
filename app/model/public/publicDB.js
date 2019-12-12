'user strict';

var mysql = require('mysql');

//local mysql db connection
var publicConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'mydb'
});

publicConnection.connect(function(err) {
    if (err) throw err;
});

module.exports = publicConnection;