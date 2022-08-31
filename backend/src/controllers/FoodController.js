'use strict';

const path = require('path');

const FoodService = require('../services/FoodService');
const UploadService = require('../services/UploadService');

// TODO: Add is_restaurant check before creating food, check customer if its exists?
const create = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		if (!req.body.hasOwnProperty('name')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a name property'
			});
		}

		if (!req.body.hasOwnProperty('price')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a price property'
			});
		}

		if (!req.body.hasOwnProperty('ingredients') || !Array.isArray(req.body.ingredients) || req.body.ingredients.length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a ingredients property'
			});
		}

		req.body.restaurant_id = req.restaurant_id;
		const food = await FoodService.create(req.body);

		return res.status(200).json(food);
	} catch (error) {
		console.error(error.message);

		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const update = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		// check if the body of the request contains all necessary properties TODO:CHECK PARAMS,check customer if if its exits?
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}

		if (!(await FoodService.get(req.params.food_id))) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Food not found`
			});
		}

		req.body.restaurant_id = req.restaurant_id;
		req.body._id = req.params.food_id;

		const food = await FoodService.update(req.body);
		if (!food) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Failed to authenticate token.'
			});
		}
		return res.status(200).json(food);
	} catch (error) {
		console.error(error.message);

		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const get = async (req, res) => {
	try {
		const food = await FoodService.get(req.params.food_id);

		if (!food) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Food not found`
			});
		}

		return res.status(200).json(food);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const remove = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		let food = await FoodService.get(req.params.food_id);

		if (!food) {
			return res.status(404).send({
				error: 'Not Found',
				message: 'Food not found!'
			});
		}

		if (food.restaurant_id !== req.restaurant_id) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Failed to authenticate token.'
			});
		}

		await FoodService.remove(req.params.food_id);
		return res.status(200).json(food);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: 'Internal server error',
			message: err.message
		});
	}
};

const getByRestaurantId = async (req, res) => {
	try {
		if (!(await FoodService.exists({ restaurant_id: req.params.restaurant_id }))) {
			return res.status(404).send({
				error: 'Not exist',
				message: 'Model with given id does not exist'
			});
		}

		let foods = await FoodService.find({ restaurant_id: req.params.restaurant_id });

		if (!foods) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Foods not found`
			});
		}

		return res.status(200).json(foods);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const createPhoto = async (req, res) => {
	try {
		req.body.path = process.env.PUBLIC_FOOD_DIRECTORY;
		req.body.filename = req.params.food_id;
		const path = await UploadService.upload(req.body);
		return res.status(200).json({ path });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const getPhoto = async (req, res) => {
	res.sendFile(
		`${req.params.food_id}.jpg`,
		{
			root: path.resolve(`${__dirname}/../../${process.env.PUBLIC_FOOD_DIRECTORY}`),
			dotfiles: 'deny'
		},
		error => {
			if (error) {
				return res.status(404).send({
					error: 'Not exist',
					message: 'Photo does not exist!'
				});
			}
		}
	);
};

module.exports = {
	create,
	update,
	get,
	remove,
	getByRestaurantId,
	createPhoto,
	getPhoto
};
