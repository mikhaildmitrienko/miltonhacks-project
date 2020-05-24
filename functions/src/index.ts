import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// const functions = require('firebase-functions');
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const yelp_api = require('../server/utils/yelp');

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



export const accountCreate = functions.auth.user().onCreate(user => {
    console.log(user.uid);
    const userDoc = {
        'email': user.email,
        'displayName': user.displayName,
        'addressLat':'',
        'addressLong':''
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
