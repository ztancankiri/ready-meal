'use strict';

const FoodModel = require('./FoodModel');
const mongoose = require('mongoose');

// Define the reservation schema
const ReservationSchema = new mongoose.Schema({
	customer_id: {
		type: String,
		required: true,
		unique: false
	},
	restaurant_id: {
		type: String,
		required: true,
		unique: false
	},
	number_of_people: {
		type: Number,
		required: true,
		unique: false
	},
	foods: {
		type: [FoodModel.schema],
		required: true,
		unique: false
	},
	reservation_status: {
		type: Number,
		required: true,
		unique: false
	},
	time: {
		type: Date,
		required: true,
		unique: false
	},
	table_number: {
		type: Number,
		required: false,
		unique: false
	},
	stripe_payment_intent_id: {
		type: String,
		required: false,
		unique: false
	},
	discount_ratio: {
		type: Number,
		required: false,
		unique: false
	}
});

ReservationSchema.set('versionKey', false);

// Export the Movie model
module.exports = mongoose.model('Reservation', ReservationSchema);
