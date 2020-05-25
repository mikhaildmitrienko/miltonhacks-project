var firestore = firebase.firestore();

function fillProfile(loggedIn) {
    if (loggedIn) {
        const docRef = firestore.doc("users/" + loggedInUser.uid);
        docRef.get().then(function (doc) {
            if (doc && doc.exists) {
                const userData = doc.data();
                console.log(userData);
                document.getElementById("username").innerHTML = userData.displayName;
                document.getElementById("email").innerHTML = userData.email;
                document.getElementById("address").innerHTML = userData.address;
                document.getElementById("coordinates").innerHTML = '('+userData.addressLat+', '+userData.addressLong+')';
                userData.interests.forEach(addInterest);

            }
        });
    }
}

function addInterest(item) {
    document.getElementById("interests").innerHTML +=
        '<span class="interest">'+item+'</span>';
}