'use strict';

const jwt = require('jsonwebtoken');
const config = require('./config');
const ObjectId = require('mongoose').Types.ObjectId;

const allowCrossDomain = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', '*');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.status(200).send(200);
	} else {
		next();
	}
};

const checkAuthentication = (req, res, next) => {
	// check header or url parameters or post parameters for token
	let token = '';
	if (req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token)
		return res.status(401).send({
			error: 'Unauthorized',
			message: 'No token provided in the request'
		});

	// verifies secret and checks exp
	jwt.verify(token, config.JwtSecret, (err, decoded) => {
		if (err)
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Failed to authenticate token.'
			});

		// if everything is good, save to request for use in other routes
		if (decoded.is_restaurant) {
			req.is_restaurant = true;
			req.restaurant_id = decoded.restaurant_id;
		} else {
			req.is_restaurant = false;
			req.customer_id = decoded.customer_id;
		}

		next();
	});
};

const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('error', { error: err });
};

const isObjectIdValid = id => {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

const checkIdValidity = (req, res, next) => {
	const paramKeys = Object.keys(req.params);

	for (let i = 0; i < paramKeys.length; i++) {
		if (paramKeys[i].toLowerCase().endsWith('id')) {
			if (!isObjectIdValid(req.params[paramKeys[i]])) {
				return res.status(404).send({
					error: 'Not exist',
					message: 'Model with given id does not exist'
				});
			}
		}
	}

	next();
};

const trimBodyHelper = data => {
	if (typeof data === 'object') {
		const keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			if (typeof data[keys[i]] === 'string') {
				data[keys[i]] = data[keys[i]].trim();
			} else {
				trimBodyHelper(data[keys[i]]);
			}
		}
	} else if (Array.isArray(data)) {
		for (let i = 0; i < data.length; i++) {
			if (typeof data[i] === 'string') {
				data[i] = data[i].trim();
			} else {
				trimBodyHelper(data[i]);
			}
		}
	}
};

const trimBody = (req, res, next) => {
	trimBodyHelper(req.body);

	next();
};

module.exports = {
	allowCrossDomain,
	checkAuthentication,
	checkIdValidity,
	errorHandler,
	trimBody
};
