import Route from "../route.js";
import {setDetail} from "../detail/detail.js";
import {getFilter} from "../filter/filter.js";

const table = $('#table-container');

var allRoutes;
var filteredRoutes;
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

const fetchRoutes = function() {
    allRoutes = [];
    filteredRoutes = [];

    for(var i=0; i < 36; i++) {
        let route = new Route(`Route #${i+1}`, [[0.0,0.0]], 'Location', 0, 0);
        route.id = i;
        allRoutes.push(route);
    }

    loadTable();
}

export const loadTable = function() {
    if (allRoutes != null) {
        table.empty();
        filteredRoutes = [];

        allRoutes.forEach(route => {
            if (filter(route)) {
                filteredRoutes.push(route);
                appendRoute(route);
            }
        })

        if (filteredRoutes.length != 0) {
            setDetail(filteredRoutes[0]);
        }
    }
};

const appendRoute = function(route) {
    let cell = renderRouteCell(route);
    table.append(cell);
    table.on("click",".route-cell-card", selectRouteCell);
}

export const prependRoute = function(route) {
    if (filteredRoutes == null) {
        allRoutes = []
        filteredRoutes = [];
        route.id = 0;
    } else {
        route.id = allRoutes.length;
    }
    allRoutes.push(route);

    if (filter(route)) {
        let cell = renderRouteCell(route);
        table.prepend(cell);
        table.on("click",".route-cell-card", selectRouteCell);

        lastSelectedId = route.id;
        setDetail(route);
    }
}

const filter = function(route) {
    switch (getFilter()) {
        case "results":
            return true;
            break;
        case "favorites":
            // TODO: use actual user name
            return route.favorites.includes("user");
            break;
        case "you":
            // TODO: use actual user name
            return route.user === "user";
            break;
    }

    return false;
}

/* Actions */

const selectRouteCell = function(event) {
    let id = parseInt(this.id, 10);

    if (lastSelectedId != id) {
        let route = filteredRoutes.filter(route => {
            return route.id == id;
        })[0]

        lastSelectedId = id;
        setDetail(route);
    }
};

$(function() {
    // fetchRoutes()
    loadTable();
});