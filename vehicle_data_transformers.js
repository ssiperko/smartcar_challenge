// Collection of functions to handle data transformations
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const { 
    ERROR, 
    NON_GAS_ERROR,
    NON_ELECTRIC_ERROR,
    COUPE,
    SEDAN,
    GAS,
    ELECTRIC,
    FAILED,
    SUCCESS
} = require('./constants');

/**
 * Transforms vehicle info data response object into paired-down vehicle info object
 * 
 * 
 * @param {Object} response .data.data: {
 *      vin: { type: 'String', value: '1235AZ91XP' },
 *      color: { type: 'String', value: 'Forest Green' },
 *      fourDoorSedan: { type: 'Boolean', value: 'False' },
 *      twoDoorCoupe: { type: 'Boolean', value: 'True' },
 *      driveTrain: { type: 'String', value: 'electric' }
 *  }}
 * 
 * @returns {"vin": vin, "color" : color, "doorCount": door_count, "driveTrain": drive_train}
 */
exports.transform_vehicle_data = (response) => {
    const data = response.data.data;
    // Clarify requirements: when response is missing data should we throw an Error or return null
    const vin = data?.vin?.value ? data?.vin?.value : null;
    const color = data?.color?.value ? data?.color?.value : null;
    // GM docs have this field as type Boolean but it is returning a string be careful
    // not to resolve as bool
    let door_count;
    const twoDoorCoupe = data?.twoDoorCoupe?.value;
    const fourDoorSedan = data?.fourDoorSedan?.value;
    if (
        twoDoorCoupe
        && twoDoorCoupe === 'True' 
        && fourDoorSedan === 'False'
    ) {
        door_count = COUPE;
    } else if (
        fourDoorSedan
        && fourDoorSedan === 'True' 
        && twoDoorCoupe === 'False'
    ) {
        door_count = SEDAN;
    } else {
        door_count = null;
    }
    const drive_train = data?.driveTrain?.value ? data?.driveTrain?.value : null; 
    return {"vin": vin, "color" : color, "doorCount": door_count, "driveTrain": drive_train}
}

/**
 * Transfors doors security data object into list of door location and status data
 * 
 * @param {Object} data {doors: {type: 'Array', values: [{location: { type: 'String', value: 'frontRight' }, locked: { type: 'Boolean', value: 'True' }} ... ]}}
 * 
 * @returns {Array[Object]} => doors = [{"location" : "frontLeft", "locked": 'True}...] 
 */
exports.transform_door_security_data = (data) => {
    const doors = data?.doors?.values.map((door)=> {
        return {"location": door?.location?.value, "locked": door?.locked?.value}
    });
    return doors;
};

/**
 * Selects tank or battery level based on power_type and returns associated range value or error
 * 
 * @param {Object} data {
 *   tankLevel: { type: 'Number', value: '23.51' },
 *   batteryLevel: { type: 'Null', value: 'null' }
 * }
 * @param {String} power_type ELECTRIC | GAS
 * 
 * @returns {Float} range || Error
 */
exports.transform_range_data = (data, power_type) => {
    let range; 
    if (power_type == ELECTRIC){
        range = data?.batteryLevel?.value
    } else if (power_type == GAS) {
        range = data?.tankLevel?.value
    }
    // TODO: clarify behavior of GM API for this error. Would hybrid vehicles break this? 
    // Could there be a situation where GM could send null for both fuel types?
    if (range === 'null' && power_type == ELECTRIC){
        throw new Error(NON_GAS_ERROR);
    } else if (range === 'null' && power_type == GAS){
        throw new Error(NON_ELECTRIC_ERROR);
    }
    return range
};

/**
 * Parses complex data object into simple string
 * 
 * @param {Object} data {
 *   service: 'actionEngine',
 *   status: '200',
 *   actionResult: { status: 'EXECUTED' }
 * }
 * 
 * @returns {String} 'SUCCESS' || 'ERROR'
 */
exports.transform_engine_status_data = (data) => {
    const status = data?.actionResult?.status == FAILED ? ERROR : SUCCESS;
    return status;
};