mapboxgl.accessToken = 'pk.eyJ1Ijoicm1hbmRlcnNvbiIsImEiOiJjazFrdHoxYWkyZm8wM25tdnpxYWp1bW9hIn0.YlLlOLiyhZdO2Ki6UPZ_NQ';
import {getRoutes, loadCustomTable} from "../table/table.js"
import {fetchRoutes } from "./table/table.js";
import {setFilter} from "../filter/filter.js";

const searchBar = $('#nav-search-bar');
const searchSuggestionContainer = $('#search-suggestion-container');

var timerId;
var matchingRoutes;
var isSearchCompleted;

const suggestionAction = function(event) {
    let eventId = this.id.replace("suggestion", "");
    let id = parseInt(eventId, 10);

    let route = matchingRoutes.filter(route => {
        return route.id == id;
    })[0]
    console.log(eventId);
    const selectedSearchTerm = route.location;

    matchingRoutes = [];
    const routes = getRoutes();
    routes.forEach(route => {
        if (new RegExp(`${selectedSearchTerm}`, "i").test(route.location) && !matchingRoutes.includes(route)) {
            matchingRoutes.push(route);
        } 
    });

    isSearchCompleted = true;
    if (matchingRoutes.length != 0) {
        setFilter("results");
        loadCustomTable(matchingRoutes);
        searchSuggestionContainer.empty();
        matchingRoutes = [];
        searchSuggestionContainer.empty();
        searchSuggestionContainer.hide();
    }
}

const renderSearchSuggestion = function(route) {
    const html = `
        <div class="search-suggestion" id="suggestion${route.id}">${route.location}</div>
    `;

    return html;
}

const combRouteLocations = function() {
    const searchInput = searchBar.val();
    matchingRoutes = [];
    searchSuggestionContainer.empty();
    searchSuggestionContainer.show();

    const routes = getRoutes();
    routes.forEach(route => {
        if (new RegExp(`${searchInput}`, "i").test(route.location) && !matchingRoutes.includes(route) && searchInput != "") {
            matchingRoutes.push(route);
        } 

        if (searchInput == "") {
            searchSuggestionContainer.hide();
        }
    });

    for(var i=0; i<matchingRoutes.length; i++) { 
        searchSuggestionContainer.append(renderSearchSuggestion(matchingRoutes[i]));
        $('.search-suggestion').on('click', suggestionAction);
    }
}

const debounce = function(func, delay) {
    clearTimeout(timerId);

    timerId = setTimeout(func, delay);
}

const searchCompletion = function() {
    debounce(combRouteLocations, 400);
    
    if (isSearchCompleted) {
        searchSuggestionContainer.empty();
        fetchRoutes();
        isSearchCompleted = false;
    } 
}

$(function() {
    isSearchCompleted = false;
    searchSuggestionContainer.empty();
    searchSuggestionContainer.hide();
    matchingRoutes = [];

    searchBar.on('input', searchCompletion);
    searchBar.on('keyup', function (e) {
        if (e.keyCode === 13) {
            isSearchCompleted = true;
            if (matchingRoutes.length != 0) {
                setFilter("results");
                loadCustomTable(matchingRoutes);
                searchSuggestionContainer.empty();
                matchingRoutes = [];
                searchSuggestionContainer.empty();
                searchSuggestionContainer.hide();
            }
        }
    });
    $('#search-icon').on('click', function() {
        isSearchCompleted = true;
        if (matchingRoutes.length != 0) {
            setFilter("results");
            loadCustomTable(matchingRoutes);
            searchSuggestionContainer.empty();
            matchingRoutes = [];
            searchSuggestionContainer.empty();
            searchSuggestionContainer.hide();
        }
    });
   
    var firebaseConfig = {
        apiKey: "AIzaSyBOD8L056KuLzFCQ5eGPO4UVvY_VKZeN8Y",
        authDomain: "routekeeper-df71a.firebaseapp.com",
        databaseURL: "https://routekeeper-df71a.firebaseio.com",
        projectId: "routekeeper-df71a",
        storageBucket: "routekeeper-df71a.appspot.com",
        messagingSenderId: "642646008649",
        appId: "1:642646008649:web:e0abc9004eafe36a30f098",
        measurementId: "G-B4JZB3VQMN"
    };
    
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
});