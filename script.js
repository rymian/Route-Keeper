import Route from "./route.js";

var routes;

const renderCompose = function() {
    const html = `
        <div id="overlay">
            <div class="card" id="compose-card">
                <div class="card-header" id="compose-header">
                    <h3>New Route</h3>
                </div>
                <div class="card-body" id="compose-body">
                    <div id='map'></div>
                    <div class='info-box'>
                        <p>Draw your route using the draw tools (25 points max)</p>
                        <div id='calculated-line'></div>
                    </div>
                </div>
                <div class="card-footer" id="compose-footer">
                    <div id="compose-cancel">
                        <div class="action-title">Cancel</div>
                    </div>
                    <div id="compose-publish">
                        <div class="action-title">Publish</div>
                    </div>
                </div>
            </div>
        </div>
  `;

    return html;
}

const dismissCompose = function() {
    $(`#overlay`).remove();
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

// Compose
const presentCompose = function() {
    $(`body`).append(renderCompose());
    $(`#compose-cancel`).on("click", dismissCompose);
}

// Profile
const presentProfile = function() {

}

export const dismissProfile = function() {

}

const addActions = function() {
    // Create
    const $create = $('#create-item');
    $create.on("click", presentCompose);

    // Route Cells
    const $routeContainer = $('#route-container');
    $routeContainer.on("click",".route-cell", handleRouteCellSelection);
}

$(function() {
    // setDetail(new Route(1, `This is a Cool Route`, 0.0));
    // addActions();
    // loadRouteCells();
});