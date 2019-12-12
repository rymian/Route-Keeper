'user strict';
var sql = require('./db.js');

//Route object constructor
var Route = function(route) {
    this.name = route.name;
    this.geometry = route.geometry;
    this.location = route.location;
    this.distance = route.distance;
    this.elevation = route.elevation;
    this.user = route.user;
    this.favorites = route.favorites;
};

Route.createRoute = function (newRoute, result) {    
        sql.query("INSERT INTO routes set ?", newRoute, function (err, res) { 
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    console.log(res.insertId);
                    result(null, res.insertId);
                }
            });           
};

Route.getRouteById = function (routeId, result) {
        sql.query("Select route from routes where id = ? ", routeId, function (err, res) {             
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    result(null, res);
                }
            });   
};

Route.getAllRoutes = function (result) {
        sql.query("Select * from routes", function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                } else {
                    console.log('routes : ', res);  

                    result(null, res);
                }
            });   
};

Route.updateById = function(id, route, result){
        sql.query("UPDATE routes SET name = ?, geometry = ?, location = ?, distance = ?, elevation = ?, user = ?, favorites = ? WHERE id = ?", [route.name, route.geometry, route.location, route.distance, route.elevation, route.user, route.favorites, id], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                } else {   
                    result(null, res);
                }
            }); 
};

Route.remove = function(id, result){
     sql.query("DELETE FROM routes WHERE id = ?", [id], function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                } else {
                    result(null, res);
                }
            }); 
};

module.exports= Route;