// Creates web server instance for Smartcar Challenge API
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const express = require('express');
const bodyParser = require('body-parser');

const { 
    ERROR, 
    NOT_FOUND 
} = require('./constants')

const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(vehicleRoutes);

/**
 * Catches any requests with no route match and returns 404 to client.
 */
app.use('/', (req, res, next) => {
    res.status(404).json({ERROR: NOT_FOUND});
});

app.listen(5001);

console.log('Smartcar API listening on PORT 5001');