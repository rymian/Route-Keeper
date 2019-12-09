const create = $('#create-item');
const composeOverlay = $('#compose-overlay')
const cancel = $('#cancel-action');
const publish = $('#publish-action');

var map;
var draw;

const setCompose = function() {
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
        var distance = (jsonResponse.routes[0].distance*0.001).toFixed(2); // convert to km
        var duration = jsonResponse.routes[0].duration/60; // convert to minutes

        // add results to info box
        document.getElementById('calculated-line').innerHTML = 'Distance: ' + distance + ' km<br>Duration: ' + duration.toFixed(2) + ' minutes';
        var coordinates = jsonResponse.routes[0].geometry;

        // elevation = getElevation(coordinates.coordinates[0][0],coordinates.coordinates[0][1]);
        // add the route to the map
        addRoute(coordinates);
    };
    req.send();
}

function addRoute (coordinates) {
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
    } else  {
        return;
    }
}

const setMap = function(center) {
    map = new mapboxgl.Map({
        container: 'compose-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-122.675246,45.529431],
        zoom: 13, 
        minZoom: 11
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
             
    map.addControl(draw);

    map.on('draw.create', updateRoute);
    map.on('draw.update', updateRoute);
    map.on('draw.delete', removeRoute);
}

/* Actions */

const presentComposeOverlay = function() {
    composeOverlay.css("display", "flex");

    setCompose();
}

const dismissComposeOverlay = function() {
    composeOverlay.css("display", "none");
}

const publishRoute = function() {

}

$(function() {
    create.on("click", presentComposeOverlay);
    cancel.on("click", dismissComposeOverlay);
});