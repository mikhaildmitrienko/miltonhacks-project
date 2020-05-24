const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('https');
const yelp_api = require('../utils/yelp');

const jsonParser = bodyParser.json();

const PORT = process.env.PORT || 4001;

app.post('/restuarant_finder', jsonParser, (req, res) => {

    yelp_api.search(req.body.term, req.body.location, req.body.sortBy).then(jsonResponse =>{
        res.status(201).send(jsonResponse);
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

