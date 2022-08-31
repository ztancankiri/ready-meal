'use strict';

const ReviewModel = require('../models/ReviewModel');

const create = async data => {
	try {
		return await ReviewModel.create(data);
	} catch (error) {
		throw error;
	}
};

const get = async (reviewId, data) => {
	try {
		let review;
		if (data) {
			review = await ReviewModel.findById(reviewId).select(data.join(' ')).exec();
		} else {
			review = await ReviewModel.findById(reviewId).exec();
		}

		return review;
	} catch (error) {
		throw error;
	}
};

const find = async filter => {
	try {
		let reviews;
		if (filter) {
			reviews = await ReviewModel.find(filter);
		} else {
			reviews = await ReviewModel.find();
		}

		return reviews;
	} catch (error) {
		throw error;
	}
};

const exists = async data => {
	try {
		let review = await ReviewModel.exists(data);
		return review;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
	exists,
	find
};
