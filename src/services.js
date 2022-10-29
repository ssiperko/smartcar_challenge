// Collection of services for interacting with data from external sources
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022


const axios = require('axios');
const { 
    JSON, 
    START, 
    START_VEHICLE, 
    STOP_VEHICLE 
} = require('./constants');

exports.get_vehicle_info_from_GM_by_id = (req_id) => {
    return axios.post('http://gmapi.azurewebsites.net/getVehicleInfoService', {
        id: req_id,
        responseType: JSON
    });
};

exports.get_door_status_from_GM_by_id = (req_id) => {
    return axios.post('http://gmapi.azurewebsites.net/getSecurityStatusService', {
        id: req_id,
        responseType: JSON
    });
};

exports.get_range_from_GM_by_id = (req_id) => {
    return axios.post('http://gmapi.azurewebsites.net/getEnergyService', {
        id: req_id,
        responseType: JSON
    })
};

exports.request_engine_status_change_from_GM = (req_id, action) => {
    return axios.post('http://gmapi.azurewebsites.net/actionEngineService', {
        id: req_id,
        command: action == START ? START_VEHICLE : STOP_VEHICLE,
        responseType: JSON
    });
};