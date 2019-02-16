const express = require('express');
const dotenv = require('dotenv').config();
const castle = require('castle');

const app = express();
const property = {...};


const properties = castle.getProperties();
const prices = castle.getPrices(property);

app.get('/', (req, res) => {
    res.send('\n\nHello, world!\n\n');
});

app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});
