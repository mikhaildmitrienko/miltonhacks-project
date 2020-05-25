var firestore = firebase.firestore();

function fillProfile(loggedIn) {
    if (loggedIn) {
        const addressField = document.getElementById("address");
        const enterToSubmit = document.getElementById("enter-to-submit");
        const docRef = firestore.doc("users/" + loggedInUser.uid);
        docRef.get().then(function (doc) {
            if (doc && doc.exists) {
                const userData = doc.data();
                console.log(userData);
                document.getElementById("username").innerHTML = userData.displayName;
                document.getElementById("email").innerHTML = userData.email;
                addressField.innerHTML = userData.address;
                document.getElementById("coordinates").innerHTML = '(' + userData.addressLat + ', ' + userData.addressLong + ')';
                userData.interests.forEach(addInterest);
                addressField.addEventListener('keydown', function (e) {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        addressField.contentEditable = 'false';
                        enterToSubmit.style.opacity = 0;
                        docRef.update({
                            address: addressField.innerHTML
                        });
                    }
                });
                addressField.addEventListener('click', function (){
                    addressField.contentEditable = 'true';
                    enterToSubmit.style.opacity = 1;
                });
            }
        });
    }
}

function signOut(){
    firebase.auth().signOut().then(function() {
      }, function(error) {
      });
}

function makeSignOutButton(success){
    document.getElementById("sign-out").addEventListener("click",()=>{
        signOut();
    })
}

function addInterest(item) {
    document.getElementById("interests").innerHTML +=
        '<span class="interest">' + item + '</span>';
}