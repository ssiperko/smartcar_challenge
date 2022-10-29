// Collection of resolver functions for routes
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const { 
    NOT_FOUND,
    BAD_GATEWAY,
    SERVER_ERROR,
    NON_GAS_ERROR,
    NON_ELECTRIC_ERROR,
    INVALID_ID, 
    INVALID_ACTION, 
    GAS,
    ELECTRIC
} = require('../constants');

const { 
    get_vehicle_info_from_GM_by_id,
    get_door_status_from_GM_by_id,
    get_range_from_GM_by_id,
    request_engine_status_change_from_GM
 } = require('../services');

 const { 
    transform_vehicle_data,
    transform_door_security_data,
    transform_range_data,
    transform_engine_status_data
} = require('../vehicle_data_transformers');

const axios = require('axios');
const { validationResult } = require('express-validator');
const { log_errors } = require('../logger/logger');


/**
 * Resolves vehicle info endpoint
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * 
 * response {
 *   "vin": (String) VIN of car || null,
 *   "color": (String) color of car || null,,
 *   "doorCount": (Int) number of doors || null,,
 *   "driveTrain": (String) drive train type || null
 * } || Error
 */
exports.get_vehicle_info_by_id = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error(INVALID_ID);
        };
    
        const req_id = req.params.id;
     
        get_vehicle_info_from_GM_by_id(req_id)
        .then((response) => {
            const is_GM_res_valid = validate_GM_res(res, response?.data?.status, response?.data?.data , req_id);
            if (!is_GM_res_valid) {
                return;
            };
            const transformed_vehicle_info_data = transform_vehicle_data(response);
            return res.status(200).json(transformed_vehicle_info_data);
        })
        .catch((error) => {
            // TODO: log incomming error
            error_handler(res, error);
        });
    } catch (error) {
        log_errors(error.message, 'Resolvers/get_vehicle_info_by_id');
        error_handler(res, error);
    }
};

/**
 * Resolves doors security endpoint
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * 
 * response (List) [
 *  {
 *   "location": (String) location on car ex. 'frontLeft',
 *   "locked" :  (Bool) is the door locked
 *  }
 * ] || Error
 */
exports.get_door_status_by_id = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error(INVALID_ID);
        };

        const req_id = req.params.id;

        get_door_status_from_GM_by_id(req_id)
        .then((response) => {
            const data = response?.data?.data;
            const is_GM_res_valid = validate_GM_res(res, response?.data?.status, data);
            if (!is_GM_res_valid) {
                return;
            };
            
            const transformed_door_security_data = transform_door_security_data(data);
            return res.status(200).json(transformed_door_security_data);
        })
        .catch((error) => {
            // TODO: log incomming error
            error_handler(res, error);
        });
    } catch (error) {
        log_errors(error.message, 'Resolvers/get_door_status_by_id');
        error_handler(res, error);
    }
};

/**
 * Resolves battery range endpoint
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * 
 * response {
 *  "percent": (Float) fuel tank percentage
 * } || Error
 */
exports.get_fuel_range_by_id = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error(INVALID_ID);
        };
        const req_id = req.params.id;
        resolve_battery_and_fuel_range_helper(res, req_id, GAS);
        return;
    } catch (error) {
        log_errors(error.message, 'Resolvers/get_fuel_range_by_id');
        error_handler(res, error); 
    }
};

/**
 * Resolves battery range endpoint
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * 
 * response {
 *  "percent": battery percentage as float
 * } || Error
 */
exports.get_battery_range_by_id = (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error(INVALID_ID);
        };
        const req_id = req.params.id;
        resolve_battery_and_fuel_range_helper(res, req_id, ELECTRIC);
        return;
    } catch (error) {
        log_errors(error.message, 'Resolvers/get_battery_range_by_id');
        error_handler(res, error); 
    }
};

/**
 * Resolves start engine and stop engine endpoints
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * 
 * POST body {
 *  "action": "START|STOP"
 * }
 * 
 * response 'success' || 'error' || error message
 */
exports.update_engine_status_by_id = (req, res, next) => {
    const errors = validationResult(req);
    // loops over validation results and returns list of errors 
    // for req_body and url params if any exist
    if (!errors.isEmpty()){
        let res_errors = errors.errors.map((error) => {
            if (error.param == 'action'){
                return {ERROR: INVALID_ACTION};
            } else if (error.param == 'id') {
                return {ERROR: INVALID_ID};
            };
        });
        for(let i in res_errors){
            log_errors(res_errors[i].ERROR, 'Resolvers/update_engine_status_by_id');
        }
        return res.status(422).send(res_errors);
    }

    const req_id = req.params.id;
    const action = req.body.action;

    request_engine_status_change_from_GM(req_id, action)
    .then((response) => {       
        const data = response?.data;
        const is_GM_res_valid = validate_GM_res(res, data?.status, data);
        if (!is_GM_res_valid) {
            return;
        };

        const transformed_engine_status_data = transform_engine_status_data(data);
        return res.status(200).send(transformed_engine_status_data);
    })
    .catch((error) => {
        log_errors(error.message, 'Resolvers/update_engine_status_by_id');
        error_handler(res, error);
    });
};


/**
 * Resolves range query for either gas or battery vehicles based on fuel type
 * 
 * 
 * @param {String} id Vehicle ID for GM internal API system passed as URL param
 * @param {String} power_type Denotes car's power_type type Gas or Electric
 */
const resolve_battery_and_fuel_range_helper = (res, req_id, power_type) => {
    get_range_from_GM_by_id(req_id)
    .then((response) => {
        const data = response?.data?.data
        const is_GM_res_valid = validate_GM_res(res, response?.data?.status, data);
        if (!is_GM_res_valid) {
            return;
        };

        const transformed_range_data = transform_range_data(data, power_type);
        return res.status(200).json({"percent": transformed_range_data});
    })
    .catch((error) => {
        log_errors(error.message, 'Resolvers/resolve_battery_and_fuel_range_helper');
        error_handler(res, error);
    });
};

/**
 * Validates the response from GM API
 * 
 * @param {Object} res express res object 
 * @param {String} status response code from GM request 
 * @param {Object} data response object from GM request (shape varies depending on request)
 * @param {String} req_id users vehicle id
 * 
 * @returns {Boolean || Error}
 */
const validate_GM_res = (res, status, data, req_id) => {
    if (status == '404'){
        if (data.reason == `Vehicle id: ${req_id} not found.`){
            throw new Error(INVALID_ID);
        } else {
            throw new Error(NOT_FOUND)
        }
    }
    if (!data){
        throw new Error(BAD_GATEWAY);
    };
    return true;
};

/**
 * Handles caught exceptions
 * 
 * @param {Object} res Express response object 
 * @param {Error} error instance of Error with message
 * @returns Error message and status
 */
const error_handler = (res, error) => {
    if (error.message == NON_ELECTRIC_ERROR){
        return res.status(400).json({ERROR: NON_ELECTRIC_ERROR});
    }
    if (error.message == NON_GAS_ERROR){
        return res.status(400).json({ERROR: NON_GAS_ERROR});
    }
    if (error.message === NOT_FOUND){
        return res.status(404).json({ERROR : NOT_FOUND});
    } 
     if (error.message === INVALID_ID){
        return res.status(422).json({ERROR: INVALID_ID});
    }  
    if (error.message === BAD_GATEWAY){
        return res.status(502).json({ERROR: BAD_GATEWAY});
    } 
    return res.status(500).json({ERROR: SERVER_ERROR});
};