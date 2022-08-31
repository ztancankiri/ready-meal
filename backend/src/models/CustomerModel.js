'use strict';

const mongoose = require('mongoose');

// Define the customer schema
const CustomerSchema = new mongoose.Schema({
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
	first_name: {
		type: String,
		required: true,
		unique: false
	},
	last_name: {
		type: String,
		required: true,
		unique: false
	},
	phone_number: {
		type: String,
		required: true,
		unique: false
	},
	stripe_customer_id: {
		type: String,
		required: false,
		unique: false
	},
	stripe_payment_method_id: {
		type: String,
		required: false,
		unique: false
	}
});

CustomerSchema.set('versionKey', false);

// Export the Movie model
module.exports = mongoose.model('Customer', CustomerSchema);
