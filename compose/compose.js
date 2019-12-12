import Route from "../route.js";
import { fetchRoutes } from "../table/table.js";

const create = $('#create-item');
const composeOverlay = $('#compose-overlay')
const cancel = $('#cancel-action');
const publish = $('#publish-action');
const composeName = $('#compose-name');
const composeSlider = $('#compose-slider');

var map;
var draw;

var isMetric = false;
var isPublic = true;

var geometry;
var location;
var distance;
var elevation;

const setCompose = function() {
    composeName.val("");

    setMap();
}

function updateRoute() {
    removeRoute();

    var data = draw.getAll();
    var answer = document.getElementById('calculated-line');
    var lastFeature = data.features.length - 1;
    var coords = data.features[lastFeature].geometry.coordinates;
    var newCoords = coords.join(';')

    getMatch(newCoords);
}

function getMatch(e) {
    var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
        var jsonResponse = req.response;

        distance = (isMetric ? (jsonResponse.routes[0].distance*0.001) : ((jsonResponse.routes[0].distance*0.001)/1.609)).toFixed(1);
        geometry = jsonResponse.routes[0].geometry;
        calculateElevation(geometry.coordinates[0][0],geometry.coordinates[0][1]);
        determineLocation(geometry.coordinates[0][0],geometry.coordinates[0][1]);

        // add the path to the map
        addPath(geometry);
    };
    req.send();
}

function calculateElevation(lng,lat) {
    // make API request
    var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + lng + ',' + lat + '.json?layers=contour&limit=50&access_token=' + mapboxgl.accessToken;
    axios({
        method: 'get',
        url: query,
    }).then(function(response) {
        // Get all the returned features
        var allFeatures = response.data.features;

        // Create an empty array to add elevation data to
        var elevations = [];

        // For each returned feature, add elevation data to the elevations array
        allFeatures.forEach(feature => {
            elevations.push(feature.properties.ele);
        });

        // In the elevations array, find the largest value
        elevation = isMetric ? Math.max(...elevations).toFixed(0) : (Math.max(...elevations)*3.281).toFixed(0);
    });
}

function determineLocation(lng,lat) {
    var query = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lng + ',' + lat + '.json?access_token=' + mapboxgl.accessToken;
    axios({
        method: 'get',
        url: query,
    }).then(function(response) {
        // Get all the returned features
        const place = response.data.features[3].place_name;
        location = place.substr(0, place.lastIndexOf("\,"));
    });
}

function addPath (coordinates) {
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
                    "geometry": coordinates
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

function removeRoute () {
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
        document.getElementById('calculated-line').innerHTML = '';

        resetRouteProperties();
    } else  {
        return;
    }
}

const setMap = function(center) {
    map = new mapboxgl.Map({
        container: 'compose-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-96, 37.8],
        zoom: 3
    });

    var currentLocation = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });

    draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            line_string: true,
            trash: true
        },
        styles: [
            {
            "id": "gl-draw-line",
            "type": "line",
            "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#3b9ddd",
                "line-dasharray": [0.2, 2],
                "line-width": 4,
                "line-opacity": 0.7
            }
            },
            {
            "id": "gl-draw-polygon-and-line-vertex-halo-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
            "paint": {
                "circle-radius": 10,
                "circle-color": "#FFF"
            }
            },
            {
            "id": "gl-draw-polygon-and-line-vertex-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
            "paint": {
                "circle-radius": 6,
                "circle-color": "#3b9ddd",
            }
            },
        ]
    });

    map.addControl(currentLocation);     
    map.addControl(draw);

    map.on('draw.create', updateRoute);
    map.on('draw.update', updateRoute);
    map.on('draw.delete', removeRoute);
}

const resetRouteProperties = function() {
    geometry = null;
    location = null;
    distance = null;
    elevation = null;
}

/* Actions */

const presentComposeOverlay = function() {
    composeOverlay.css("display", "flex");

    setCompose();
}

const dismissComposeOverlay = function() {
    resetRouteProperties();

    composeOverlay.css("display", "none");
}

const publishRoute = function() {
    const name = titleCase(composeName.val());

    if (name.length !== 0 && geometry != null) {
        isPublic = composeSlider.is(':checked');
        var query = isPublic ? 'http://localhost:3000/public/routes/' : 'http://localhost:3000/private/routes/';

        const geometryJSON = JSON.stringify(geometry);
        const user = "user";
        const favoritesJSON = JSON.stringify([]);

        axios({
            method: 'post',
            url: query,
            data: {
                "name": name,
                "geometry": geometryJSON,
                "location": location,
                "distance": distance,
                "elevation": elevation,
                "user": user,
                "favorites": favoritesJSON
            }
        }).then(function(response) {
            fetchRoutes();
            dismissComposeOverlay(); 
        });
    } else {
        console.log("Please fill in required fields.");
    }
}

/* Helpers */

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

$(function() {
    create.on("click", presentComposeOverlay);
    cancel.on("click", dismissComposeOverlay);
    publish.on("click", publishRoute);
});