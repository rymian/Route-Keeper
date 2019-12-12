import { fetchRoutes } from "../table/table.js";

const profile = $('#profile-item');
const profileCancel = $('#profile-cancel-button');
const profileOverlay = $('#profile-overlay');
const profileContainer = $('#profile-container');

const profileUsername = $('#profile-username');
const profileUsernameGroup = $('#profile-username-group');
const profileEmail = $('#profile-email');
const profilePassword = $('#profile-password');
const profileHeader = $('#profile-header');

const loginButton = $('#login-button');
const signUpButton = $('#sign-up-button');
const profileButton = $('#profile-action');
const deleteButton = $('#delete-button');

var isExistingUser;

const setProfile = function() {
    profile.on("click", presentProfileOverlay);
    profileCancel.on("click", dismissProfileOverlay);
    loginButton.on("click", loginAction);
    signUpButton.on("click", signUpAction);
    deleteButton.on("click", deleteAction);
    deleteButton.hide();

    profileUsername.val("");
    profileEmail.val("");
    profilePassword.val("");

    loginAction();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            profile.children('i').removeClass();
            profile.children('i').addClass("fa fa-user");

            profileContainer.css("justify-content", 'flex-start');

            profileButton.unbind('click');
            profileButton.on("click", logoutAction); 

            $("#profile-inputs").hide();
            $("#profile-btn-group").hide();
            $("#profile-actions").css("margin-top", '144px');
            profileButton.css("width", '40%');
            profileButton.children("div").text("Log Out");
            deleteButton.css("width", '40%');
            deleteButton.css("display", 'flex');

            profileHeader.css("font-size", '3em');

            if (user.displayName != null) {
                profileHeader.text("Hello, " + user.displayName);
            } else if (firebase.auth().currentUser.displayName != null) {
                profileHeader.text("Hello, " + firebase.auth().currentUser.displayName);
            } else {
                console.log(user.displayName);
                console.log(firebase.auth().currentUser.displayName);

                profileHeader.text("Welcome");
            }
        } else {
            profile.children('i').removeClass();
            profile.children('i').addClass("fa fa-user-o");
            
            profileContainer.css("justify-content", 'space-between');

            profileButton.unbind('click');
            profileButton.on("click", profileAction);

            $("#profile-inputs").show();
            $("#profile-btn-group").show();
            $("#profile-actions").css("margin-top", '0px');
            profileButton.css("width", '100%');
            profileButton.children("div").text("Continue");
            deleteButton.css("width", '0%');
            deleteButton.css("display", 'none');

            profileHeader.css("font-size", '6em');
            profileHeader.text("Welcome");
        }
    });
}

/* Actions */

const profileAction = function() {
    const username = profileUsername.val();
    const email = profileEmail.val();
    const password = profilePassword.val();

    if (isExistingUser) {
        login(email, password);
    } else {
        signUp(username, email, password);
    }
}

const loginAction = function() {
    isExistingUser = true;

    profileUsername.val("");
    profileUsernameGroup.hide();

    loginButton.removeClass('unselected');
    loginButton.addClass('selected');
            
    signUpButton.removeClass('selected');
    signUpButton.addClass('unselected');
}

const signUpAction = function() {
    isExistingUser = false;

    profileUsername.val("");
    profileUsernameGroup.show();

    signUpButton.removeClass('unselected');
    signUpButton.addClass('selected');
            
    loginButton.removeClass('selected');
    loginButton.addClass('unselected');
}

const login = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": " + errorMessage);
    });      
}

const signUp = function(username, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        firebase.auth().currentUser.updateProfile({
            displayName: username,
            photoURL: ""
        }).then(successfulAuth())
     }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": " + errorMessage);
    });
}

const logoutAction = function() {
    firebase.auth().signOut().then(function() {
        profile.children('i').removeClass();
        profile.children('i').addClass("fa fa-user-o");

        fetchRoutes();
        dismissProfileOverlay();
    }).catch(function(error) {
        console.log(error);
    });
}

const deleteAction = function() {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
        profile.children('i').removeClass();
        profile.children('i').addClass("fa fa-user-o");

        fetchRoutes();
        dismissProfileOverlay();
    }).catch(function(error) {
        console.log(error)
    });
}

const successfulAuth = function() {
    profile.children('i').removeClass();
    profile.children('i').addClass("fa fa-user");

    dismissProfileOverlay();
}

const presentProfileOverlay = function() {
    isExistingUser = true;
    profileOverlay.css("display", "flex");

    setProfile();
}

const dismissProfileOverlay = function() {
    profileOverlay.css("display", "none");
}

$(function() {
    setProfile();
});