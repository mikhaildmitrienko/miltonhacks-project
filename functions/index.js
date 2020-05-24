const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const yelp_api = require('../server/utils/yelp');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = express();

const jsonParser = bodyParser.json();
app.use(cors({ origin: true }));

app.post('/restuarant_finder', jsonParser, (req, res) => {

    yelp_api.search(req.body.term, req.body.location, req.body.sortBy).then(jsonResponse =>{
        res.status(201).send(jsonResponse);
    });
});


exports.widgets = functions.https.onRequest(app);


exports.accountCreate = functions.auth.user().onCreate(user => {
    console.log(user.uid);
    const userDoc = {
        'email': user.email,
        'displayName': user.displayName,
        'addressLat':'',
        'addressLong':'',
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