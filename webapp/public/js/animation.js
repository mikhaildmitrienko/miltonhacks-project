function homeAnimationInit() {
    var navTop = document.getElementById("navigation-top").style;
    var topBG = document.getElementById("top-bg").style;
    // document.getElementById("nav-title").addEventListener("click", function(){window.location.replace("login.html")});
    window.onscroll = function () { scrollFunction(); };
    function scrollFunction() {
        var scrollTop = document.documentElement.scrollTop;
        topBG.backgroundPositionY = -(scrollTop / 3) + "px";;
        if (scrollTop / window.innerHeight >= 0.01) {
            navTop.backgroundColor = "#ffffff";
        }
        else {
            navTop.backgroundColor = "transparent";
        }
    }
}

function initProfilePic(loggedIn) {
    if (loggedIn){
        document.getElementById("profile-pic").setAttribute("src", loggedInUser.photoURL)
        document.getElementById("profile-pic").hidden = false;
        if (document.getElementById("login-button")){
            document.getElementById("login-button").hidden = true;
        }
    }
    document.body.classList.remove('fade-out');
}

function loginAnimationInit() {
    document.body.classList.remove('fade-out');
}

function profileAnimationInit() {
}


