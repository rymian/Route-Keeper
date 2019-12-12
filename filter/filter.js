import {fetchRoutes} from "../table/table.js"

const filter = $('#filter-container');
const results = $('#filter-results');
const favorites = $('#filter-favorites');
const you = $('#filter-you');


var selectedFilter = "results";

const resultsAction = function() {
    selectedFilter = "results";
    setFilterButtonStyle();

    fetchRoutes();
}

const favoritesAction = function() {
    selectedFilter = "favorites";
    setFilterButtonStyle();

    fetchRoutes();
}

const youAction = function() {
    selectedFilter = "you";
    setFilterButtonStyle();

    fetchRoutes();
}

export const getFilter = function() {
    return selectedFilter;
}

const setFilterButtonStyle = function() {
    switch (selectedFilter) {
        case "results":
            results.removeClass('unselected');
            results.addClass('selected');
            
            favorites.removeClass('selected');
            favorites.addClass('unselected');

            you.removeClass('selected');
            you.addClass('unselected');
            break;
        case "favorites":
            favorites.removeClass('unselected');
            favorites.addClass('selected');

            results.removeClass('selected');
            results.addClass('unselected');

            you.removeClass('selected');
            you.addClass('unselected');
            break;
        case "you":
            you.removeClass('unselected');
            you.addClass('selected');

            results.removeClass('selected');
            results.addClass('unselected');

            favorites.removeClass('selected');
            favorites.addClass('unselected');
            break;
    }
}

export const setFilter = function(filter) {
    selectedFilter = filter;
    setFilterButtonStyle();
}

$(function() {
    results.on("click", resultsAction);
    favorites.on("click", favoritesAction);
    you.on("click", youAction);

    setFilterButtonStyle();
});