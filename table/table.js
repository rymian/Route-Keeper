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
        url: 'http://localhost:3000/public/routes/',
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

        if (getFilter() === "you") {
            fetchPrivateRoutes();
        } else {
            loadTable();
        }
    });
}

export const getRoutes = function() {
    return allRoutes;
}

const fetchPrivateRoutes = function() {
    axios({
        method: 'get',
        url: 'http://localhost:3000/private/routes/',
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
            newRoute.isPublic = false;
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

export const loadCustomTable = function(routes) {
    if (allRoutes != null) {
        table.empty();
        lastSelectedId = 1;

        routes.forEach(route => {
            appendRoute(route);
        })

        setDetail(routes[0]);
    }
}

const appendRoute = function(route) {
    let cell = renderRouteCell(route);
    table.append(cell);
    $(`#${route.id}`).on("click", selectRouteCell);
    if (!route.isPublic) {
        $(`#${route.id}`).addClass('private');
    }
}


const filter = function(route) {
    switch (getFilter()) {
        case "results":
            return true;
            break;
        case "favorites":
            if (firebase.auth().currentUser.displayName != null) {
                return route.favorites.includes(firebase.auth().currentUser.displayName);
            } 
            return false;
            break;
        case "you":
            if (firebase.auth().currentUser.displayName != null) {
                return route.user === firebase.auth().currentUser.displayName;
            } 
            return false;
            break;
    }

    return false;
}

/* Actions */

const selectRouteCell = function(event) {
    let id = parseInt(this.id, 10);
    if (getFilter() !== 'you') {
        if (lastSelectedId != id) {
            let route = filteredRoutes.filter(route => {
                return route.id == id;
            })[0]

            lastSelectedId = id;
            setDetail(route);
        }
    } else {
        let route = allRoutes.filter(route => {
            return route.id == id;
        })[0]

        lastSelectedId = id;
        setDetail(route);
    }
};

$(function() {
    fetchRoutes()
});