const renderRouteCell = function(i) {
    var html = `
    <div class="card route-cell">
        <div class="card-body route-cell-body">
            <h3>Route #${i}</h3>
        </div>
    </div>
    `;
    return html;
};

const loadRouteCells = function() {
    const $routeContainer = $('#route-container');

    for(var i = 0; i < 36; i++) {
        var cell = renderRouteCell(i+1);
        $routeContainer.append(cell);
    }
};

$(function() {
    loadRouteCells();

    console.log("Test");
});