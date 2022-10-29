// Handles logging for API package
//
// Author: Steven Siperko - ssiperko@fake_email.com - 10/27/2022

const fs = require('fs');

/**
 * Takes incomming error and location, parses those inputs into a log string and stores in file
 * 
 * @param {Error} error instance of Error object
 * @param {String} origin method that threw error
 * @returns 
 */
exports.log_errors = (error, origin) => {
    const log = new Date() + ' --- ' + 'Error message: ' + error + ' --- ' + ' Thrown from: ' + origin + "\n"
    fs.appendFile("./logger/error_logs.txt", log, (err) => {
        return;
    });
    return;
};