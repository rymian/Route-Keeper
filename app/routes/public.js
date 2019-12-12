'use strict';
module.exports = function(app) {
    var routeList = require('../controller/appController');

    app.route('/public/routes')
    .get(routeList.list_all_routes)
    .post(routeList.create_a_route);
   
    app.route('/public/routes/:routeId')
    .get(routeList.read_a_route)
    .put(routeList.update_a_route)
    .delete(routeList.delete_a_route);
};