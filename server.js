const express = require('express');

const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

app.use(vehicleRoutes);

/**
 * Catches any requests with no route match and returns 404 to client.
 */
app.use('/', (req, res, next) => {
    res.status(404).send('Resource not found. Please, check your path and try again.');
});

app.listen(5001);

console.log('Smartcar API listening on PORT 5001');