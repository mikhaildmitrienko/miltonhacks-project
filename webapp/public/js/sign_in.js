var _provider;
var loggedInUser;

function initSignIn(onSignInFunc) {
    // alert(window.location.pathname + window.location.search);
    _provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            if (onSignInFunc) onSignInFunc(true);
        } else {
            if (!(window.location.pathname + window.location.search).includes("login.html") && document.getElementById("this-is-the-login-page") === null && document.getElementById("login-page") === null) {
                sessionStorage.lastURL = window.location.href;
                window.location.replace(
                    "login.html"
                );
            }
        }
    });
}

function initSignInGentle(onSignInFunc) {
    _provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            if (onSignInFunc) onSignInFunc(true);
        } else {
            if (onSignInFunc) onSignInFunc(false);
        }
    });
}

function signIn() {
    firebase
        .auth()
        .signInWithPopup(_provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(function () {
            // Sign-out successful.
        })
        .catch(function (error) {
            // An error happened.
        });
}
