
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

function returnResult(resultList, person) {
    document.getElementById("title").innerHTML = "";
    document.getElementsByClassName("discover-page")[0].style.backgroundImage = "url(img/fuckkkkkkkk.svg)";
    // document.getElementsByClassName("discover-page")[0].style.height = "200%";
    document.getElementById("replaceable").innerHTML =
        '<div class="result-content">' +
        '<div id="result-title">Result</div>' +
        `<div id="eating-with">Eating with ${person}</div>` +
        '<div id="best-bets">Your best bets are</div>' +
        '<div id="restaurant-list">';
    resultList.forEach((item) => {
        document.getElementById("restaurant-list").innerHTML += `<div id = "restaurant-result"> <img src="${item.restaurant.thumb}" class="result-img">${item.restaurant.name} (${item.restaurant.user_rating.aggregate_rating}🌟)</div>`;
    })
    document.getElementById("replaceable").innerHTML += '</div></div>';

}

function requestMatch() {
    userDocRef = firestore.doc("users/" + loggedInUser.uid);
    matchCollectionRef = firestore.collection("matches");
    userDocRef.get().then(function (doc) {
        userData = doc.data();
        console.log("match requested by " + loggedInUser.email + " to " + document.getElementById("friend-name").value);
        const matchRequest = {
            from: loggedInUser.uid,
            fromId: loggedInUser.email,
            to: document.getElementById("friend-name").value.toLowerCase(),
            fromAddress: userData.address,
            fromLat: userData.addressLat,
            fromLong: userData.addressLong,
            foodType: document.getElementById("food-type").value,
            results: 0,
            toLat: 0,
            toLong: 0
        };
        fetch(`https://us-central1-miltonhacksii.cloudfunctions.net/getMidpoint?lat=${userData.addressLat}&long=${userData.addressLong}&toMail=${document.getElementById("friend-name").value.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                getZomatoRequest(document.getElementById("food-type").value,
                    data.lat,
                    data.long,
                    matchRequest.to
                );
            })

        console.log(matchRequest);
        matchCollectionRef.add(matchRequest);
    });

}

function getZomatoRequest(keyword, lat, long, friend) {
    const requestUrl = `https://developers.zomato.com/api/v2.1/search?q=${keyword}&lat=${lat}&lon=${"-71.16687999999999"}&radius=1609&sort=rating&order=desc`;

    console.log(requestUrl);

    var result = ["not queried"];

    const userKey = 'c300606e72cc7a23491dd6a0b424b1f1';

    fetch(requestUrl, {
        method: 'GET', // or 'PUT'
        headers: {
            'user-key': userKey,
        },
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // result = JSON.parse(data).restaurants;
            console.log('Success:', data);
            var listOfRestaurants = data.restaurants.slice(0, 5);
            returnResult(listOfRestaurants, friend);
        })
        .catch((error) => {
            result = ["error"];
            console.error('Error:', error);
            var listOfRestaurants = result;
            returnResult(listOfRestaurants, friend);
        });
}

function addRequestButton(success) {
    if (success) {
        document.getElementById("submit").addEventListener("click", requestMatch);
    }
}