'use strict';
module.exports = function(app) {
  var todoList = require('../controller/appController');

    // Routes Routes
    app.route('/routes')
    .get(todoList.list_all_routes)
    .post(todoList.create_a_route);
   
    app.route('/routes/:routeId')
    .get(todoList.read_a_route)
    .put(todoList.update_a_route)
    .delete(todoList.delete_a_route);
};

