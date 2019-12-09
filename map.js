mapboxgl.accessToken = 'pk.eyJ1Ijoicm1hbmRlcnNvbiIsImEiOiJjazFrdHoxYWkyZm8wM25tdnpxYWp1bW9hIn0.YlLlOLiyhZdO2Ki6UPZ_NQ';

export function addRoute (map,coordinates) {
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

// 
// var map = new mapboxgl.Map({
//         container: 'map', // container id
//         style: 'mapbox://styles/mapbox/streets-v9', //hosted style id
//         center: [-122.675246,45.529431], // starting position
//         zoom: 13, // starting zoom
//         minZoom: 11 // keep it local
//     });
    
// var draw = new MapboxDraw({
// displayControlsDefault: false,
// controls: {
//     line_string: true,
//     trash: true
// },
// styles: [
//     // ACTIVE (being drawn)
//     // line stroke
//     {
//     "id": "gl-draw-line",
//     "type": "line",
//     "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
//     "layout": {
//         "line-cap": "round",
//         "line-join": "round"
//     },
//     "paint": {
//         "line-color": "#3b9ddd",
//         "line-dasharray": [0.2, 2],
//         "line-width": 4,
//         "line-opacity": 0.7
//     }
//     },
//     // vertex point halos
//     {
//     "id": "gl-draw-polygon-and-line-vertex-halo-active",
//     "type": "circle",
//     "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
//     "paint": {
//         "circle-radius": 10,
//         "circle-color": "#FFF"
//     }
//     },
//     // vertex points
//     {
//     "id": "gl-draw-polygon-and-line-vertex-active",
//     "type": "circle",
//     "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
//     "paint": {
//         "circle-radius": 6,
//         "circle-color": "#3b9ddd",
//     }
//     },
// ]
// });

// // add the draw tool to the map
// map.addControl(draw);

// // use the coordinates you just drew to make your directions request
// function updateRoute() {
//     removeRoute(); // overwrite any existing layers
//     var data = draw.getAll();
//     var answer = document.getElementById('calculated-line');
//     var lastFeature = data.features.length - 1;
//     var coords = data.features[lastFeature].geometry.coordinates;
//     var newCoords = coords.join(';')
//     getMatch(newCoords);
// }

// // make a directions request
// function getMatch(e) {
//     // https://www.mapbox.com/api-documentation/#directions
//     var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
//     var req = new XMLHttpRequest();
//     req.responseType = 'json';
//     req.open('GET', url, true);
//     req.onload  = function() {
//         var jsonResponse = req.response;
//         distance = (jsonResponse.routes[0].distance*0.001).toFixed(2); // convert to km
//         var duration = jsonResponse.routes[0].duration/60; // convert to minutes

//         // add results to info box
//         document.getElementById('calculated-line').innerHTML = 'Distance: ' + distance + ' km<br>Duration: ' + duration.toFixed(2) + ' minutes';
//         coordinates = jsonResponse.routes[0].geometry;

//         elevation = getElevation(coordinates.coordinates[0][0],coordinates.coordinates[0][1]);
//         // add the route to the map
//         addRoute(coordinates);
//     };
//     req.send();
// }

// function getElevation(lng,lat) {
//     // make API request
//     var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + lng + ',' + lat + '.json?layers=contour&limit=50&access_token=' + mapboxgl.accessToken;
//     axios({
//         method: 'get',
//         url: query,
//     }).then(function(response) {
//         // Get all the returned features
//         var allFeatures = response.data.features;

//         // Create an empty array to add elevation data to
//         var elevations = [];

//         // For each returned feature, add elevation data to the elevations array
//         allFeatures.forEach(feature => {
//             elevations.push(feature.properties.ele);
//         });

//         // In the elevations array, find the largest value
//         var highestElevation = Math.max(...elevations);
//         return highestElevation;
//     });
//   }

// adds the route as a layer on the map


// remove the layer if it exists
// function removeRoute () {
//     if (map.getSource('route')) {
//         map.removeLayer('route');
//         map.removeSource('route');
//         document.getElementById('calculated-line').innerHTML = '';
//     } else  {
//         return;
//     }
// }

// // add create, update, or delete actions
// map.on('draw.create', updateRoute);
// map.on('draw.update', updateRoute);
// map.on('draw.delete', removeRoute);

