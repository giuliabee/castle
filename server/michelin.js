'use strict';

const http = require("http");
const https = require("https");

//from https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express#9577651

let getJSON = function (options, onResult) {
    console.log("rest::getJSON");

    let port = options.port == 443 ? https : http;
    let req = port.request(options, function (res) {
        let output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            if (output.charCodeAt(0) === 0xFEFF) {
                output = output.substr(1);  // remove BOM
            }

            let obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function (err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

// Returns all starred restaurants in France
let getRestaurants = function (callback) {
    let options = {
        host: 'mrest.viamichelin.com',
        port: 443,
        path: '/apir/2/findPoi.json2/RESTAURANT/eng?authKey=JSBS20110420095823966694697480' +
            '&obfuscation=false&charset=utf-8&dist=1000000000&nb=100&sidx=0' +
            '&source=AGG&fields.split=description%2Cspecialite&ie=utf-8' +
            '&center=2.3508%3A48.8567&orderby=distance%3Aasc' +
            '&filter=(michelin_stars+in+[1%2C2%2C3])+AND+countrycode+in+[FRA%2CDEU]',
        method: 'GET',
    };

    getJSON(options, callback);
};

module.exports = {
    getRestaurants: getRestaurants
};
