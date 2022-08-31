'use strict';

const FoodModel = require('../models/FoodModel');
// TODO: check if the same food exist.
const create = async data => {
	try {
		return await FoodModel.model.create(data);
	} catch (error) {
		throw error;
	}
};

const update = async data => {
	try {
		return await FoodModel.model
			.findOneAndUpdate({ _id: data._id, restaurant_id: data.restaurant_id }, data, {
				new: true,
				runValidators: true
			})
			.exec();
	} catch (error) {
		throw error;
	}
};

const get = async (foodId, data) => {
	try {
		let food;
		if (data) {
			food = await FoodModel.model.findById(foodId).select(data.join(' ')).exec();
		} else {
			food = await FoodModel.model.findById(foodId).exec();
		}

		return food;
	} catch (error) {
		throw error;
	}
};

const remove = async foodId => {
	try {
		let food = await FoodModel.model.findById(foodId).remove().exec();
		return food;
	} catch (error) {
		throw error;
	}
};

const find = async filter => {
	try {
		let foods;
		if (filter) {
			foods = await FoodModel.model.find(filter);
		} else {
			foods = await FoodModel.model.find();
		}

		return foods;
	} catch (error) {
		throw error;
	}
};

const exists = async data => {
	try {
		let food = await FoodModel.model.exists(data);
		return food;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
	update,
	get,
	remove,
	exists,
	find
};
