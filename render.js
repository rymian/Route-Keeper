const renderRouteCell = function(i) {
    var html = `
    <div class="card route-cell" id="${i}">
        <div class="card-body route-cell-body">
            <h3>Route #${i+1}</h3>
        </div>
    </div>
    `;
    return html;
};

const renderDetailCard = function(i) {
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
            <h1>Route #${i+1}</h1>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div>
    `;
    return html;
}

const handleRouteCellSelection = function(event) {
    let id = parseInt(this.id, 10);
    $(`#detail-card`).replaceWith(renderDetailCard(id));
};

const loadRouteCells = function() {
    const $routeContainer = $('#route-container');
    const $detailContainer = $('#detail-container');

    let detailCard = renderDetailCard(0);
    $detailContainer.append(detailCard);

    for(var i = 0; i < 36; i++) {
        let cell = renderRouteCell(i);
        $routeContainer.append(cell);
    }

    $routeContainer.on("click",".route-cell", handleRouteCellSelection);
};

$(function() {
    loadRouteCells();

    console.log("Test");
});