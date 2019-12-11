import Route from "../route.js";
import {setDetail} from "../detail/detail.js"

const table = $('#table-container');

var routes;
var lastSelectedId = 0;

/* Render RouteCells */

const renderRouteCell = function(route) {
    var html = `
    <div class="card route-cell-card" id="${route.id}">
        <div class="card-body route-cell-body">
            <div class="horizontal">
                <div class="vertical">
                    <div class="route-cell-name">${route.name}</div>
                    <div class="route-cell-location">${route.location}</div>
                </div>
                <div class="route-cell-distance">${route.distance} mi</div>

            </div>
        </div>
    </div>
    `;
    return html;
};

/* Loads RouteCells into the table */

const loadRouteCells = function() {
    // fetchRoutes().forEach(route => {
    //     appendRoute(route);
    // })

    // setDetail(routes[0]);
};

const fetchRoutes = function() {
    routes = [];

    for(var i=0; i < 36; i++) {
        let route = new Route(`Route #${i+1}`, [[0.0,0.0]], 'Location', 0, 0);
        route.id = i;
        routes.push(route);
    }

    return routes;
}

const appendRoute = function(route) {
    let cell = renderRouteCell(route);
        table.append(cell);
        table.on("click",".route-cell-card", selectRouteCell);
}

export const prependRoute = function(route) {
    if (routes == null) {
        routes = [];
        route.id = 0;
    } else {
        route.id = routes.length;
    }
    routes.push(route);

    let cell = renderRouteCell(route);
    table.prepend(cell);
    table.on("click",".route-cell-card", selectRouteCell);

    lastSelectedId = route.id;
    setDetail(route);
}

/* Actions */

const selectRouteCell = function(event) {
    let id = parseInt(this.id, 10);

    if (lastSelectedId != id) {
        let route = routes.filter(route => {
            return route.id == id;
        })[0]

        lastSelectedId = id;
        setDetail(route);
    }
};

$(function() {
    loadRouteCells();
});