const profile = $('#profile-item');
const profileOverlay = $('#profile-overlay')

const profileEmail = $('profile-email');
const profilePassword = $('profile-password');

const profileButton = $('profile-button');

var isExistingUser = true;

/* Actions */

const profileAction = function() {
    const email = profileEmail.val();
    const password = profilePassword.val();

    if (isExistingUser) {

    } else {
        createAccount(email, password);
    }
}

const createAccount = function(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

const login = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });      
}

const presentProfileOverlay = function() {
    profileOverlay.css("display", "flex");
}

const dismissProfileOverlay = function() {
    profileOverlay.css("display", "none");
}

$(function() {
   profile.on("click", presentProfileOverlay);
});