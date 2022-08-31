'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const middlewares = require('./middlewares');
const PaymentRoute = require('./routes/PaymentRoute');
const CustomerRoute = require('./routes/CustomerRoute');
const RestaurantRoute = require('./routes/RestaurantRoute');

const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);

// Basic route
api.get('/', (req, res) => {
	res.json({
		name: 'ReadyMeal Backend'
	});
});

// API routes
api.use(`${process.env.PATH_PREFIX}/payment`, PaymentRoute);
api.use(`${process.env.PATH_PREFIX}/customer`, CustomerRoute);
api.use(`${process.env.PATH_PREFIX}/restaurant`, RestaurantRoute);

module.exports = api;
