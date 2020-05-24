var _provider;

function initSignIn(onSignInFunc) {
    _provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (onSignInFunc) onSignInFunc();
        } else {
            if (window.location.href.slice(-10) != "login.html") {
                sessionStorage.lastURL = window.location.href;
                window.location.replace(
                    "login.html"
                );
            }   
        }
    });
}

function initPageRedirect() {
    
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
