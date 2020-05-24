function homeAnimationInit() {
    document.body.classList.remove('fade-out');
    var navTop = document.getElementById("navigation-top").style;
    var topBG = document.getElementById("top-bg").style;
    document.getElementById("nav-title").addEventListener("click", function(){window.location.replace("index.html")});
    // document.getElementById("nav-title").addEventListener("click", function(){window.location.replace("login.html")});
    window.onscroll = function () { scrollFunction(); };
    function scrollFunction() {
        var scrollTop = document.documentElement.scrollTop;
        topBG.backgroundPositionY = -(scrollTop / 8) + "px";;
        if (scrollTop / window.innerHeight >= 0.01) {
            navTop.backgroundColor = "#ffffff";
        }
        else {
            navTop.backgroundColor = "transparent";
        }
    }
}

function loginAnimationInit() {
    document.body.classList.remove('fade-out');
}


