// Collection of constants to be used throughout the package
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

// General use constants
exports.SEDAN = 4;
exports.COUPE = 2;
exports.START = 'START';
exports.STOP = 'STOP';
exports.JSON = 'JSON';
exports.START_VEHICLE = "START_VEHICLE";
exports.STOP_VEHICLE = "STOP_VEHICLE";
exports.ELECTRIC = 'electric';
exports.GAS = 'gas';
exports.FAILED = 'FAILED';
exports.SUCCESS = 'SUCCESS';

//Error constants
exports.ERROR = 'ERROR';
exports.BAD_GATEWAY = "Bad Gateway";
exports.SERVER_ERROR = "Internal server error";
exports.NOT_FOUND = "Resource not found. Please, check your path and try again.";
exports.NON_ELECTRIC_ERROR = 'Cannot fetch battery information on non-electric vehicles';
exports.NON_GAS_ERROR = 'Cannot fetch fuel tank information on electric vehicles';
exports.INVALID_ACTION = 'Action is invalid';
exports.INVALID_ID = 'ID is invalid';
exports.TOO_MANY_REQUESTS = 'Too many requests, please try again later.'
