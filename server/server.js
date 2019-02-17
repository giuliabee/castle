'use strict';

const castle = require('./castle');
const michelin = require('./michelin');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

let bestHotels = {};
let frenchHotels = {};
let starredRestaurants = {};
let prices = {};
let SaturdayPrices = {};


castle.getHotels(function (err, hotels) {
    let i = 1;

    for (let id in hotels) {
        let hotel = hotels[id];
        if (hotel.countryName === 'France') {
            frenchHotels[i] = hotel;
        }
        i++;
    }

    michelin.getRestaurants(function (err, restaurants) {
        for (let poi_id in restaurants) {
            starredRestaurants[poi_id] = restaurants[poi_id];
        }

        for (let id in frenchHotels) {
            let hotel = frenchHotels[id];

            for (let poi_id in starredRestaurants.poiList) {
                if (hotel.RC_NOM_RESTAU === starredRestaurants.poiList[poi_id].datasheets.name ||
                    hotel.RC_NOM_SECOND_RESTAU === starredRestaurants.poiList[poi_id].datasheets.name) {
                    bestHotels[id] = hotel;
                }
            }
        }

        for (let id in bestHotels) {
            prices[id] = castle.getPrices(id);
        }

        let today = new Date();
        let firstDay = new Date();

        firstDay.setDate(1);
        firstDay.setMonth(today.getMonth());
        firstDay.setFullYear(today.getFullYear());

        let daysInMonths = {0: 31, 1: 28, 2: 31, 3: 30, 4: 31, 5: 30, 6: 31, 7: 31, 8: 30, 9: 31, 10: 30, 11: 31}
        let Saturday = (6 - firstDay.getDay());


        for (let id in bestHotels) {
            SaturdayPrices[id] = {};

            for (let i = Saturday; i <= daysInMonths[today.getMonth()]; i += 7) {
                SaturdayPrices[id].i = prices[id].i;
            }

        }
    });
});
