'use strict';

const castle = require('./castle');
const michelin = require('./michelin');
const express = require('express');

const app = express();
const port = 3000;

let bestHotels = {};
let frenchHotels = {};
let starredRestaurants = {};
let prices = {};
let saturdayPrices = {};

let getSaturdayPrices = function (req, res) {
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
                    if (hotel.RC_NOM_RESTAU === starredRestaurants.poiList[poi_id].datasheets[0].name ||
                        hotel.RC_NOM_SECOND_RESTAU === starredRestaurants.poiList[poi_id].datasheets[0].name) {
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
            let saturday = (7 - firstDay.getDay());


            for (let id in bestHotels) {
                saturdayPrices[id] = {
                    saturdayPrices: {}
                };

                let key = today.getFullYear() + '-' + (today.getMonth() + 1);

                saturdayPrices[id].name = bestHotels[id].RC_NOM_L;
                saturdayPrices[id].link = 'https://www.relaischateaux.com/us/france/' + bestHotels[id].RC_CODE;

                try {
                    for (let i = saturday; i <= daysInMonths[today.getMonth()]; i += 7) {
                        if (prices[id][key].pricesPerDay[i] !== undefined) {
                            saturdayPrices[id].saturdayPrices[i] = prices[id][key].pricesPerDay[i];
                        }
                    }
                } catch (e) {

                }

            }

            res.send(JSON.stringify(saturdayPrices));
        });
    });

}


app.get('/getSaturdayPrices', getSaturdayPrices);

app.listen(port);
