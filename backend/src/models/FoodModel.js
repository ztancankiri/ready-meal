'use strict';

const mongoose = require('mongoose');

// Define the food schema
const FoodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: false
	},
	price: {
		type: Number,
		required: true,
		unique: false
	},
	ingredients: {
		type: [String],
		required: true,
		unique: false
	},
	photo: {
		type: String,
		required: false,
		unique: false
	},
	restaurant_id: {
		type: String,
		required: true,
		unique: false
	}
});

FoodSchema.set('versionKey', false);

// Export the Movie model
module.exports = {
	model: mongoose.model('Food', FoodSchema),
	schema: FoodSchema
};
