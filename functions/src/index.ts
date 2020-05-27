import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as yelp_fusion from 'yelp-fusion';

// const yelp_api = require('yelp-fusion');
const yelp = require('yelp-fusion');

// const functions = require('firebase-functions');
// const express = require('express');
const cors = require('cors')({ origin: true });
// const bodyParser = require('body-parser');
// const yelp_api = require('../server/utils/yelp');
const request = require('request');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// export const yelpRequest = functions.https.onRequest((req, res) => {
//     return fetch(`https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`
//       }
//     }).then(response => {
//       res.status(201).send(response);
//     });
//   })

// const apiKey = 'h-1yi4jHs4kNaYbifUTJdVU4o7-qCBih--cCJgBnjY8a18ShGf_FRl0o_IwxUHt0VOHmXgV6ehSk5_Nx8ERhyHH08-Fbx1o1bDVQE-Ka0gTs_GF868Q95o-S6MvKXnYx';
// export const yelpRequest = functions.https.onRequest((req, res) => {
//     return fetch(`https://api.yelp.com/v3/businesses/search?&latitude=${req.query.longitude}&longitude=${req.query.latitude}`, {
//         headers: {
//             Authorization: `Bearer ${apiKey}`
//         }
//     }).then(response => {
//         res.status(201).send(response);
//     });
// })

// const apiKey = 'h-1yi4jHs4kNaYbifUTJdVU4o7-qCBih--cCJgBnjY8a18ShGf_FRl0o_IwxUHt0VOHmXgV6ehSk5_Nx8ERhyHH08-Fbx1o1bDVQE-Ka0gTs_GF868Q95o-S6MvKXnYx';



// export const yelpRequest = functions.https.onRequest((req, res) => {

//     var uid = req.query.uid?.toString;

//     if (uid != undefined) {
//         var searchRequest = {};

// admin.firestore().collection('users')
//     .doc(uid).get().then((userData: any) => {
//         if (userData && userData.exists) {
//             searchRequest = {
//                 latitude: userData.data()['addressLat'],
//                 longitude: userData.data()['addressLong']
//             }
//         }
//     }
//     );

//         const client = yelp_fusion.client(apiKey);
//         client.search(searchRequest).then((response: any) => {
//             const firstResult = response.jsonBody.businesses[0];
//             const prettyJson = JSON.stringify(firstResult, null, 4);
//             console.log(prettyJson);
//         }).catch((e: any) => {
//             console.log(e);
//         });
//     }
// })

export const getMidpoint = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var result = {};
        admin.firestore().collection("users")
            .where("email", "==", req.query.toMail).limit(1).get()
            .then((toSnapshot) => {
                if (!toSnapshot.empty && req.query.lat != undefined) {
                    const midLat = (Number(req.query.lat) + Number(toSnapshot.docs[0].data().addressLat)) / 2;
                    const midLong = (Number(req.query.long) + Number(toSnapshot.docs[0].data().addressLong)) / 2;
                    result = {
                        lat: midLat,
                        long: midLong
                    };
                    res.status(200).json(result);
                }
                else {
                    result = {
                        lat: req.query.lat,
                        long: req.query.long,
                        err: "toUserNotFound; snapshot empty"
                    };
                    res.status(200).json(result);
                }

            })
            .catch(err => {
                console.log(err);
                result = {
                    lat: req.query.lat,
                    long: req.query.long,
                    err: "toUserNotFound, line 105"
                };
                res.status(200).json(result);
            });
    });
});

export const yelpDocRequest = functions.firestore
    .document('matches/{matchID}')
    .onCreate((snapshot, context) => {
        const matchData = snapshot.data();
        if (matchData) {
            admin.firestore().collection("users")
                .where("email", "==", matchData.to).limit(1).get()
                .then((toSnapshot) => {
                    if (!toSnapshot.empty) {
                        const returnedRestaurant = getYelpRequest(matchData.foodType, matchData.fromLat, matchData.fromLong);
                        console.log(returnedRestaurant);
                        const returnedRestaurants = getZomatoRequest(matchData.foodType, matchData.fromLat, matchData.fromLong);
                        return snapshot.ref.update({
                            // results: 20,
                            toLat: toSnapshot.docs[0].data().addressLat,
                            toLong: toSnapshot.docs[0].data().addressLong,
                            restaurants: returnedRestaurants,
                            results: returnedRestaurants.length,
                        });
                        // getRestaurants(matchData.fromLat, matchData.fromLong, toSnapshot.addressLat, toSnapshot.addressLong);
                    }
                    else {
                        return snapshot.ref.update({
                            results: 30,
                            err_message: 'error_in_cloud_functions_94: user not available'
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    return snapshot.ref.update({
                        results: 30,
                        err_message: 'error_in_cloud_functions_103'
                    });
                });
            return snapshot.ref.update({
                results: 30,
                // to:'error_in_cloud_functions_108@gmail.com'
            });
        }
        else {
            return null;
        }
        return null;
    }
    );

// function getRestaurants(person1lat, person1long, person2lat, person2long) {

// }

const apiKey = 'h-1yi4jHs4kNaYbifUTJdVU4o7-qCBih--cCJgBnjY8a18ShGf_FRl0o_IwxUHt0VOHmXgV6ehSk5_Nx8ERhyHH08-Fbx1o1bDVQE-Ka0gTs_GF868Q95o-S6MvKXnYx';


const userKey = 'c300606e72cc7a23491dd6a0b424b1f1';
// function getZomatoRequest(keyword: String, lat: String, long: String) {
//     const requestUrl = `https://developers.zomato.com/api/v2.1/search?q=${keyword}&lat=${lat}&lon=${long}&radius=1609&sort=rating&order=desc`;

//     var result = ["not queried"];

//     fetch(requestUrl, {
//         method: 'POST', // or 'PUT'
//         headers: {
//             'user-key': userKey,
//         },
//     })
//         .then(response => response.json())
//         .then(data => {
//             result = JSON.parse(data).restaurants;
//             console.log('Success:', data);
//         })
//         .catch((error) => {
//             result = ["error"];
//             console.error('Error:', error);
//         });
//     return result;
// }

function getZomatoRequest(keyword: String, lat: String, long: String) {
    var result = ["API not queried"];
    const options = {
        url: `https://developers.zomato.com/api/v2.1/search?q=${keyword}&lat=${lat}&lon=${long}&radius=1609&sort=rating&order=desc`,
        headers: {
            'user-key': userKey,
        }
    };
    function callback(error: any, response: any, body: any) {
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);
        }
        else {
            result = [error];
        }
    }
    request(options, callback);

    return result;
}

function getYelpRequest(keyword: String, lat: String, long: String) {
    const searchRequest = {
        term: keyword,
        latitude: +lat,
        longitude: +long,
    };
    const client = yelp.client(apiKey);

    var result = ["Did not request."];

    client.search(searchRequest).then((response: any) => {
        const firstResult = response.jsonBody.businesses[0];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        result = response.jsonBody.businesses;
        console.log(prettyJson);
    }).catch((e: any) => {
        console.log(e);
        result = ["no results found"];
    });
    return result;
}


//Fake distance finder
const restuarants1 = {
    "McDonalds": 2,
    "Wendy's": 3,
    "Legal Seafood": 4
};

const restuarants2 = {
    "McDonalds": 7,
    "Wendy's": 3,
    "Legal Seafood": 5
};
// https://us-central1-miltonhacksii.cloudfunctions.net/distance_finder?id=1
export const distance_finder = functions.https.onRequest((req, res) => {

    const matchDoc = {
        'results': ["McDonalds", "Wendy's", "Legal Sea Foods"],
    }

    if (req.query.id === '1') {
        res.status(200).json(restuarants1);
    } else {
        res.status(200).json(restuarants2);
    }

    return admin.firestore().collection('matches').add(matchDoc);
});



export const distance = functions.https.onRequest((req, res) => {
    request(`https://maps.googleapis.com/maps/api/directions/json?
    origin=${req.query.user_latitude},${req.query.user_longitude}&
    destination=${req.query.restuarant_latitude},${req.query.restuarant_longitude}&
    key=AIzaSyA_jaJFyahK5tDzWsUVMUuWFwmCR6YUelE`, (err: any, inner_res: any, body: any) => {
        if (err) {
            console.log(err);
        }
        console.log(body)
    }).then((jsonResponse: any) => {
        const miles = jsonResponse['routes']['legs']['distance']['text'];
        res.send(JSON.stringify(miles));
    });
});



export const accountCreate = functions.auth.user().onCreate(user => {
    console.log(user.uid);
    const userDoc = {
        'email': user.email,
        'displayName': user.displayName,
        'address': '[address]',
        'addressLat': '',
        'addressLong': '',
        'interests': []
    }
    admin.firestore().collection('users').doc(user.uid)
        .set(userDoc).then(writeResult => {
            console.log('User Created result:', writeResult);
            return;
        }).catch(err => {
            console.log(err);
            return;
        });
});
