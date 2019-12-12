'use strict';

var Route = require('../model/private/privateAppModel.js');

exports.list_all_routes = function(req, res) {
  Route.getAllRoutes(function(err, route) {

    console.log('controller')
    if (err) {
        res.send(err);
    }
    console.log('res', route);
    res.send(route);
  });
};

exports.create_a_route = function(req, res) {
  var new_route = new Route(req.body);

  //handles null error 
   if (!new_route.name || !new_route.geometry) {
        res.status(400).send({ error:true, message: 'Please provide route/geometry' });
    } else {
        Route.createRoute(new_route, function(err, route) {
    
        if (err) {
            res.send(err);
        }

        res.json(route);
  });
}
};


exports.read_a_route = function(req, res) {
  Route.getRouteById(req.params.routeId, function(err, route) {
    if (err) {
      res.send(err);
    }
    res.json(route);
  });
};


exports.update_a_route = function(req, res) {
  Route.updateById(req.params.routeId, new Route(req.body), function(err, route) {
    if (err) {
      res.send(err);
    }
    res.json(route);
  });
};


exports.delete_a_route = function(req, res) {
  Route.remove( req.params.routeId, function(err, route) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Route successfully deleted' });
  });
};