// Creates web server instance for Smartcar Challenge API
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const { log_errors } = require('./logger/logger');

const { 
    ERROR, 
    NOT_FOUND,
    TOO_MANY_REQUESTS
} = require('./constants')

const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// config for rate limiter
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // max requests per window
    message: {ERROR: TOO_MANY_REQUESTS},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// middleware
app.use(limiter)
app.use(bodyParser.json({extended: false}));
app.use(vehicleRoutes);

/**
 * Catches any requests with no route match and returns 404 to client.
 */
app.use('/', (req, res, next) => {
    log_errors(Error(NOT_FOUND), '/server.js');
    res.status(404).json({ERROR: NOT_FOUND});
});

app.listen(5001);

console.log('Smartcar API listening on PORT 5001');
