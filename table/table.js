import Route from "../route.js";
import {setDetail} from "../detail/detail.js";
import {getFilter} from "../filter/filter.js";

const table = $('#table-container');

var allRoutes;
var filteredRoutes;
var lastSelectedId = 1;

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

export const fetchRoutes = function() {
    allRoutes = [];
    filteredRoutes = [];

    axios({
        method: 'get',
        url: 'http://localhost:3000/public/routes',
    }).then(function(response) {
        const data = response.data;
        data.reverse().forEach(d => {
            const id = d['id'];
            const name = d['name'];
            const geometry = JSON.parse(d['geometry']);
            const user = d['user'];
            const location = d['location'];
            const distance = d['distance'];
            const elevation = d['elevation'];
            const favorites = JSON.parse(d['favorites']);

            const newRoute = new Route(id, name, geometry, location, distance, elevation, favorites, user);
            allRoutes.push(newRoute);
        });

        loadTable();
    });
}

const loadTable = function() {
    if (allRoutes != null) {
        table.empty();
        lastSelectedId = 1;
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
    $(`#${route.id}`).on("click", selectRouteCell);
}


const filter = function(route) {
    switch (getFilter()) {
        case "results":
            return true;
            break;
        case "favorites":
            // TODO: use actual user name
            return route.favorites.includes("User");
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
    fetchRoutes()
});