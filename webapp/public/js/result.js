
// document.getElementById("submit").addEventListener("click", returnResult);

var firestore = firebase.firestore();



function getResult(success) {
    if (success) {
        const apiKey = 'h-1yi4jHs4kNaYbifUTJdVU4o7-qCBih--cCJgBnjY8a18ShGf_FRl0o_IwxUHt0VOHmXgV6ehSk5_Nx8ERhyHH08-Fbx1o1bDVQE-Ka0gTs_GF868Q95o-S6MvKXnYx';
        docRef = firestore.doc("users/" + loggedInUser.uid);
        docRef.get().then(function (doc) {
            userData = doc.data();
            const data =
            {
                latitude: userData.addressLat,
                longitude: userData.addressLong
            }
            fetch(`https://api.yelp.com/v3/businesses/search`, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    Authorization: `bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }).then(response => {
                // res.status(201).send(response);
                console.log(response.body);
            });
        }

        )
    }
}

function returnResult() {
    document.getElementById("title").innerHTML = "";
    document.getElementById("replaceable").innerHTML =
        '<div class="account-button" onclick="window.location.replace(' +
        "'profile.html')" +
        '">' +
        '<img id="profile-pic" hidden=true>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="profile-content">' +
        '<div id="username">Result</div>' +
        `<div id="email">Eating with Aaron Lockhart</div>` +
        '<div id="address">Your best bets are</div>' +
        '<div id="interests">Wendys, McDonalds, Legal Sea Foods</div>' +
        '</div>';
}

function requestMatch() {
    userDocRef = firestore.doc("users/" + loggedInUser.uid);
    matchCollectionRef = firestore.collection("matches");
    userDocRef.get().then(function (doc) {
        userData = doc.data();
        console.log("match requested by " + loggedInUser.email);
        const matchRequest = {
            from:loggedInUser.uid,
            fromId:loggedInUser.email,
            to:"michael.dmitrienko@gmail.com",
            fromAddress: userData.address,
            fromLat: userData.addressLat,
            fromLong: userData.addressLong,
            results:0,
            toLat:0,
            toLong:0
        }
        console.log(matchRequest);
        matchCollectionRef.add(matchRequest);
    });
}

function addRequestButton(success){
    if(success){
        document.getElementById("submit").addEventListener("click", requestMatch);
    }
}