'user strict';

var mysql = require('mysql');

var privateConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'myPrivateDB'
});

privateConnection.connect(function(err) {
    if (err) throw err;
});

module.exports = privateConnection;