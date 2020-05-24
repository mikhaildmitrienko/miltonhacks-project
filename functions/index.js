const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const request = require('request');
//const yelp_api = require('../server/utils/yelp');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// const app = express();

// const jsonParser = bodyParser.json();
// app.use(cors({ origin: true }));

// app.post('/restuarant_finder', jsonParser, (req, res) => {

//     yelp_api.search(req.body.term, req.body.location, req.body.sortBy).then(jsonResponse =>{
//         res.status(201).send(jsonResponse);
//     });
// });

// exports.widgets = functions.https.onRequest(app);
apiKey = 'pQ18CTIwUG2SkogWiPpuAXA57XiRnDjLNMrBOoEug3IDPv8kEkiwrz_WnWmzLEc0ed2yWgwwgTCXN7VCeW9dm6MX8kLCW4tVr--x6yWASOwWrgDkjvuf_fc5eseoXnYx';

exports.yelp = functions.https.onRequest((req, res) => {
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${req.latitude}&longitude=${req.longitude}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }).then(response => {
      res.status(201).send(response);
    });
  }).catch(err =>{
      return res.status(404).send(err);
  });

exports.distance = functions.https.onRequest((req, res)=>{
    return fetch(`https://maps.googleapis.com/maps/api/directions/json?
    origin=${req.body.user.latitude,req.body.user.longitude}&
    destination=${req.body.restuarant.latitude,req.body.restuarant.longitude}
    &key=AIzaSyA_jaJFyahK5tDzWsUVMUuWFwmCR6YUelE`).then(response => 
        {return response.json()}).then(jsonResponse =>{
            res.status(201).send(JSON.stringify(jsonResponse.routes.legs.distance));
        })
});


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