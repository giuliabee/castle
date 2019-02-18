'use strict';

const net = require('net');

const port = 3000;
const host = '127.0.0.1';
const path = '/getSaturdayPrices';

let prices = {};

const client = new net.Socket();

client.connect({port: port, host: host, path}, function() {
    console.log('Connected');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    prices = data;
});

client.on('close', function() {
    console.log('Connection closed');
});
