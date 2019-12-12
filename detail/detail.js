import Route from "../route.js";
import {getFilter} from "../filter/filter.js";
import {fetchRoutes} from "../table/table.js";

const detailMap = $('#detail-map');
const detailName = $('#detail-name');
const detailUser = $('#detail-user');
const detailLocation = $('#detail-location');
const detailDistance = $('#detail-distance');
const detailElevation = $('#detail-elevation');
const detailFavorites = $('#detail-favorites');

const favorite = $('#favorite-action');
const share = $('#share-action');
const deleteButton = $('#delete-action');

var detailRoute;

export const setDetail = function(route) {
    favorite.unbind('click');
    share.unbind('click');
    deleteButton.unbind('click');

    if (getFilter() === "you") {
        deleteButton.show();
    } else {
        deleteButton.hide();
    }

    detailRoute = route;

    setMap();
    setName();
    setUser();
    setLocation();
    setDistance();
    setElevation();
    setFavorites();

    favorite.on("click", favoriteAction);
    share.on("click", shareAction);
    deleteButton.on("click", deleteAction);
}

const setMap = function() {
    const geometry = detailRoute.geometry;

    const midIndex = Math.floor(geometry.coordinates.length/2);
    const midCoordinate = geometry.coordinates[midIndex];

    var map = new mapboxgl.Map({
        container: 'detail-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: midCoordinate,
        zoom: 12
    });
    map.on('load', function() {
        addPath(map, geometry);

        var bounds = geometry.coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(geometry.coordinates[0], geometry.coordinates[0]));
             
        map.fitBounds(bounds, {
            padding: 20
        });
    });
}

function addPath(map, geometry) {
    // check if the route is already loaded
    if (map.getSource('route')) {
        map.removeLayer('route')
        map.removeSource('route')
    } else{
        map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": geometry
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#3b9ddd",
                "line-width": 8,
                "line-opacity": 0.8
            }
        });
    };
}

/* Set Values of Detail Fields */

const setName = function() {
    detailName.text(`${detailRoute.name}`);
}

const setUser = function() {
    detailUser.text(`${detailRoute.user}`);
}

const setLocation = function() {
    detailLocation.text(`${detailRoute.location}`);
}

const setDistance = function() {
    detailDistance.text(`${detailRoute.distance} mi`);
}

const setElevation = function() {
    detailElevation.text(`${detailRoute.elevation} ft`);
}

const setFavorites = function() {
    detailFavorites.text(`${detailRoute.favorites.length}`);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (detailRoute.favorites.includes(user.displayName)) {
                favorite.children('i').removeClass();
                favorite.children('i').addClass("fa fa-star");
            } else {
                favorite.children('i').removeClass();
                favorite.children('i').addClass("fa fa-star-o");
            }
        } else {
            if (firebase.auth().currentUser.displayName != null) {
                if (detailRoute.favorites.includes(firebase.auth().currentUser.displayName)) {
                    favorite.children('i').removeClass();
                    favorite.children('i').addClass("fa fa-star");
                } else {
                    favorite.children('i').removeClass();
                    favorite.children('i').addClass("fa fa-star-o");
                }
            }
        }
    });
}

/* Actions */

const favoriteAction = function() {
    if (firebase.auth().currentUser.displayName != null) {
        if (!detailRoute.favorites.includes(firebase.auth().currentUser.displayName)) {
            detailRoute.favorites.push(firebase.auth().currentUser.displayName)
        } else {
            const targetIndex = detailRoute.favorites.indexOf(firebase.auth().currentUser.displayName);
            detailRoute.favorites.splice(targetIndex,1);
        }

        var geometryJSON = JSON.stringify(detailRoute.geometry);
        var favoritesJSON = JSON.stringify(detailRoute.favorites);
        var query = detailRoute.isPublic ? 'http://localhost:3000/public/routes/' : 'http://localhost:3000/private/routes/';

        axios({
            method: 'put',
            url: query + detailRoute.id,
            data: {
                "name": detailRoute.name,
                "geometry": geometryJSON,
                "location": detailRoute.location,
                "distance": detailRoute.distance,
                "elevation": detailRoute.elevation,
                "user": detailRoute.user,
                "favorites": favoritesJSON
            }
        }).then(function(response) {
            if (getFilter() === "favorites") {
                fetchRoutes();
            }
            setFavorites(detailRoute.favorites);
        });
    }
}

const shareAction = function() {
    if (navigator.share) {
        navigator.share({
            title: route.name + "on Route Keeper",
            text: "Checkout this running route I just came across!",
            url: window.location.href
        }).then(function () {
            console.log("Success")
        }).catch(function () {
            console.log("Error")
        })
    } 
}

const deleteAction = function() {
    var query = detailRoute.isPublic ? 'http://localhost:3000/public/routes/' : 'http://localhost:3000/private/routes/';
    axios({
        method: 'delete',
        url: query + detailRoute.id,
    }).then(function(response) {
        if (getFilter() === "you") {
            fetchRoutes();
        }
    });
}

$(function() {
    if (navigator.share) {
        share.show();
        favorite.css('margin-right','16px');
    } else {
        share.hide();
        favorite.css('margin-right','0px');
    }
});