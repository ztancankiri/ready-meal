'use strict';

const mongoose = require('mongoose');

// Define the restaurant schema
const RestaurantSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		unique: false
	},
	phone_number: {
		type: String,
		required: true,
		unique: false
	},
	restaurant_name: {
		type: String,
		required: true,
		unique: false
	},
	address_street: {
		type: String,
		required: true,
		unique: false
	},
	address_number: {
		type: String,
		required: true,
		unique: false
	},
	address_code: {
		type: String,
		required: true,
		unique: false
	},
	address_city: {
		type: String,
		required: true,
		unique: false
	},
	photo: {
		type: String,
		required: false,
		unique: false
	},
	number_of_tables: {
		type: Number,
		required: true,
		unique: false
	},
	discount_ratio: {
		type: Number,
		required: false,
		unique: false
	},
	rating: {
		type: Number,
		required: false,
		unique: false
	},
	number_of_reviews: {
		type: Number,
		required: false,
		unique: false
	}
});

RestaurantSchema.set('versionKey', false);

// Export the Movie model
module.exports = mongoose.model('Restaurant', RestaurantSchema);
