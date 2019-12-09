import Route from "../route.js";
import { addRoute } from "../map.js";

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
    setMap(route.coordinates);
    setName(route.name);
    setUser(route.user);
    setLocation(route.location);
    setDistance(route.distance);
    setElevation(route.elevation);
    setFavorites(route.favorites);
    setActions(route);
}

const setMap = function(coordinates) {
    var map = new mapboxgl.Map({
        container: 'detail-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-122.675246,45.529431],
        zoom: 13, 
        minZoom: 11
    });

    // addRoute(map, coordinates);
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
    detailDistance.text(`${distance}`);
}

const setElevation = function(elevation) {
    detailElevation.text(`${elevation}`);
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
}