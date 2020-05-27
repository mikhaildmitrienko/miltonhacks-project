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
                        enterToSubmit.style.color = "black";
                        enterToSubmit.innerHTML = "Press Enter to Submit"
                        enterToSubmit.style.opacity = 0;
                        const requestLink = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${addressField.innerHTML}&facet=state&facet=timezone&facet=dst`
                        fetch(requestLink)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                const resLat = data.records[0].fields.latitude;
                                const resLong = data.records[0].fields.longitude;
                                document.getElementById("coordinates").innerHTML = '(' + resLat + ', ' + resLong + ')';
                                docRef.update({
                                    address: addressField.innerHTML,
                                    addressLong: resLong,
                                    addressLat: resLat
                                });
                            }).catch((err) => {
                                enterToSubmit.style.opacity = 1;
                                enterToSubmit.style.color = "red";
                                enterToSubmit.innerHTML = "Please enter a valid zipcode."
                                console.log(err);
                            }
                            );

                    }
                });
                addressField.addEventListener('click', function () {
                    addressField.contentEditable = 'true';
                    enterToSubmit.style.opacity = 1;
                });
            }
        });
    }
}

function signOut() {
    firebase.auth().signOut().then(function () {
    }, function (error) {
    });
}

function makeSignOutButton(success) {
    document.getElementById("sign-out").addEventListener("click", () => {
        signOut();
    })
}

function addInterest(item) {
    document.getElementById("interests").innerHTML +=
        '<span class="interest">' + item + '</span>';
}