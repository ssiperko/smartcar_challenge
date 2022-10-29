const fs = require('fs');

exports.log_errors = (error, location) => {
    const log = new Date() + ' --- ' + 'Error message: ' + error + ' --- ' + ' Thrown from: ' + location + "\n"
    fs.appendFile("./logger/error_logs.txt", log, (err) => {
        console.log(err);
    });
    return;
};