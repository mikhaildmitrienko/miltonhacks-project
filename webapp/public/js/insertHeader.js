var xhr = new XMLHttpRequest();
xhr.open('GET', 'components/header.html', true);
xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return; // or whatever error handling you want
    document.getElementById('insert-header').innerHTML = this.responseText;
    document.getElementById("nav-title").addEventListener("click", function(){window.location.replace("index.html")});
};
xhr.send();

