'use strict';

var request = require('sync-request');

const people = 2;
const rooms = 1;
let today = new Date();

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

let getJSONSync = function (url) {
    let res = request('GET', url);
    let output = res.getBody('utf8');
    if (output.charCodeAt(0) === 0xFEFF) {
        output = output.substr(1);  // remove BOM
    }
    return JSON.parse(output);
};

// Returns *all* hotels from relaischateaux website
let getHotels = function (callback) {
    let options = {
        host: 'api.relaischateaux.com',
        port: 443,
        path: '/dsGHsfg4/members',
        method: 'GET',
    };

    getJSON(options, callback);
};

let getPrices = function (id) {
    let url = 'https://www.relaischateaux.com/us/search/availability/check?month='
        + today.getFullYear() + '-' + (today.getMonth() + 1) + '&idEntity=' + id + '&pax=' + people + '&room=' + rooms;
    return getJSONSync(url);
};

module.exports = {
    getHotels: getHotels,
    getPrices: getPrices
};
