import Route from "../route.js";

const detailMap = $('#detail-map');
const detailName = $('#detail-name');
const detailUser = $('#detail-user');
const detailLocation = $('#detail-location');
const detailDistance = $('#detail-distance');
const detailElevation = $('#detail-elevation');
const detailFavorites = $('#detail-favorites');

const favorite = $('#favorite-action');
const share = $('#share-action');

export const setDetail = function(route) {
    setMap(route.geometry);
    setName(route.name);
    setUser(route.user);
    setLocation(route.location);
    setDistance(route.distance);
    setElevation(route.elevation);
    setFavorites(route.favorites);
    setActions(route);
}

const setMap = function(geometry) {
    const midIndex = Math.floor(geometry.coordinates.length/2);
    const midCoordinate = geometry.coordinates[midIndex];

    var map = new mapboxgl.Map({
        container: 'detail-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: midCoordinate,
        zoom: 14
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

const setName = function(name) {
    detailName.text(`${name}`);
}

const setUser = function(user) {
    detailUser.text(`${user}`);
}

const setLocation = function(location) {
    detailLocation.text(`${location}`);
}

const setDistance = function(distance) {
    detailDistance.text(`${distance} mi`);
}

const setElevation = function(elevation) {
    detailElevation.text(`${elevation} ft`);
}

const setFavorites = function(favorites) {
    detailFavorites.text(`${favorites}`);
}

/* Actions */

const setActions = function(route) {
    favorite.on("click", function() {
        favoriteAction(route);
    });
    share.on("click", function() {
        shareAction(route);
    });
}

const favoriteAction = function(route) {
    console.log(`${route.name} was favorited.`);
}

const shareAction= function(route) {
    console.log(`${route.name} was shared.`);

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

$(function() {
    if (navigator.share) {
        share.show();
        favorite.css('margin-right','16px');
    } else {
        share.hide();
        favorite.css('margin-right','0px');
    }
});