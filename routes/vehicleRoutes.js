const express = require('express');

const { 
    get_vehicle_info_by_id, 
    get_door_status_by_id, 
    get_fuel_range_by_id, 
    get_battery_range_by_id, 
    start_stop_engine_by_id
} = require('../controllers/vehicleControllers');

const router = express.Router();

router.get('/vehicles/:id', get_vehicle_info_by_id);

router.get('/vehicles/:id/doors', get_door_status_by_id);

router.get('/vehicles/:id/fuel', get_fuel_range_by_id);

router.get('/vehicles/:id/battery', get_battery_range_by_id);

router.post('/vehicles/:id/engine', start_stop_engine_by_id);

module.exports = router;