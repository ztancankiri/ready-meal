'use strict';

const mongoose = require('mongoose');

// Define the review schema
const ReviewSchema = new mongoose.Schema({
	reservation_id: {
		type: String,
		required: true,
		unique: false
	},
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
	comment: {
		type: String,
		required: false,
		unique: false
	},
	grade: {
		type: Number,
		required: true,
		unique: false
	}
});

ReviewSchema.set('versionKey', false);

// Export the Movie model
module.exports = mongoose.model('Review', ReviewSchema);
