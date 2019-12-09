import Route from "./route.js";

var routes;

const renderRouteCell = function(route) {
    var html = `
    <div class="card route-cell" id="${route.id}">
        <div class="card-body route-cell-body">
            <h3>${route.name}</h3>
        </div>
    </div>
    `;
    return html;
};

const renderDetailCard = function(route) {
    var html = `
    <div class="card" id="detail-card">
        <div id='card-map'></div>
        <script>
            mapboxgl.accessToken = 'pk.eyJ1Ijoicm1hbmRlcnNvbiIsImEiOiJjazFrdHoxYWkyZm8wM25tdnpxYWp1bW9hIn0.YlLlOLiyhZdO2Ki6UPZ_NQ';
            var map = new mapboxgl.Map({
                                        container: 'card-map',
                                        style: 'mapbox://styles/mapbox/streets-v11'
                                    });
        </script>
        <div class="card-body">
            <h1>${route.name}</h1>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div>
    `;
    return html;
}

const handleRouteCellSelection = function(event) {
    let id = parseInt(this.id, 10);
    let route = routes.filter(route => {
        return route.id == id;
    })

    $(`#detail-card`).replaceWith(renderDetailCard(route[0]));
};

const loadRouteCells = function() {
    const $routeContainer = $('#route-container');
    const $detailContainer = $('#detail-container');

    fetchRoutes().forEach(route => {
        let cell = renderRouteCell(route);
        $routeContainer.append(cell);
    })

    $routeContainer.on("click",".route-cell", handleRouteCellSelection);

    let detailCard = renderDetailCard(routes[0]);
    $detailContainer.append(detailCard);  
};

const fetchRoutes = function() {
    routes = [];

    for(var i=0; i < 36; i++) {
        let route = new Route(i, `Route #${i+1}`, 0.0);
        routes.push(route);
    }

    return routes;
}

$(function() {
    loadRouteCells();
});