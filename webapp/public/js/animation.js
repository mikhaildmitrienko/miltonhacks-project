window.onload = function () {
    init()
};

// document.getElementById("black-fade-out").style.backgroundColor="transparent";

function init() {
    document.body.classList.remove('fade-out');
    var topBG = document.getElementById("top-bg").style;
    window.onscroll = function () { scrollFunction(); };
    function scrollFunction() {
        console.log(document.documentElement.scrollTop)
        topBG.backgroundPositionY = -(document.documentElement.scrollTop/10) + "px";;
    }

}


