'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RestaurantModel = require('../models/RestaurantModel');

const create = async data => {
	try {
		data.password = bcrypt.hashSync(data.password, 8);
		const reservation_body = Object.assign(data, {
			discount_ratio: 0,
			rating: 0,
			number_of_reviews: 0
		});
		// find and update restaurant with id
		const restaurant = await RestaurantModel.create(reservation_body);

		// return created restaurant
		return restaurant;
	} catch (error) {
		throw error;
	}
};

const get = async restaurantId => {
	try {
		const restaurant = await RestaurantModel.findById(restaurantId).exec();

		if (restaurant) restaurant.password = undefined;
		return restaurant;
	} catch (error) {
		throw error;
	}
};

const update = async data => {
	try {
		// find and update restaurant with id
		if (data.password) {
			data.password = bcrypt.hashSync(data.password, 8);
		}

		const restaurant = await RestaurantModel.findByIdAndUpdate(data.restaurant_id, data, {
			new: true, // return the updated document.
			runValidators: true
		}).exec();

		if (restaurant) restaurant.password = undefined;
		// return updated restaurant
		return restaurant;
	} catch (error) {
		throw error;
	}
};

const remove = async restaurantId => {
	try {
		// find and delete restaurant with id
		const restaurant = await RestaurantModel.findByIdAndDelete(restaurantId).exec();

		// return deleted restaurant
		return restaurant;
	} catch (error) {
		throw error;
	}
};

const find = async filter => {
	try {
		if (filter) {
			return await RestaurantModel.find(filter);
		} else {
			return await RestaurantModel.find();
		}
	} catch (error) {
		throw error;
	}
};

const login = async (email, password) => {
	try {
		const restaurant = await RestaurantModel.findOne({ email: email }).exec();

		// check if the password is valid
		if (!restaurant || !bcrypt.compareSync(password, restaurant.password)) {
			return null;
		}

		const token = jwt.sign({ restaurant_id: restaurant._id, is_restaurant: true }, process.env.JWT_SECRET, {
			expiresIn: process.env.AUTH_TOKEN_EXPIRE_TIME
		});

		return token;
	} catch (error) {
		throw error;
	}
};

const exists = async data => {
	try {
		let restaurant = await RestaurantModel.exists(data);
		return restaurant;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
	get,
	update,
	remove,
	find,
	login,
	exists
};
