// Collection of routes for vehicle endpoints
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const express = require('express');
const { body, param } = require('express-validator');

// endpoint resolvers
const { 
    get_vehicle_info_by_id, 
    get_door_status_by_id, 
    get_fuel_range_by_id, 
    get_battery_range_by_id, 
    update_engine_status_by_id
} = require('../resolvers/vehicleResolvers');

const router = express.Router();

// endpoints
router.get('/vehicles/:id', [
    param('id').trim().isString().isLength({max: 5})
], get_vehicle_info_by_id);

router.get('/vehicles/:id/doors', [
    param('id').trim().isString().isLength({max: 5})
],get_door_status_by_id);

router.get('/vehicles/:id/fuel', [
    param('id').trim().isString().isLength({max: 5})
],get_fuel_range_by_id);

router.get('/vehicles/:id/battery', [
    param('id').trim().isString().isLength({max: 5})
],get_battery_range_by_id);

router.post('/vehicles/:id/engine', [
    body('action').trim().isLength({max: 5}),
    param('id').trim().isString().isLength({max: 5})
], update_engine_status_by_id);

module.exports = router;