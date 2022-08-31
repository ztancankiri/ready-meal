'use strict';

const CustomerService = require('../services/CustomerService');

const create = async (req, res) => {
	try {
		if (req.body && Object.keys(req.body).length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}
		if (await CustomerService.exists({ email: req.body.email })) {
			return res.status(409).send({
				error: 'Email Already Registered',
				message: 'This Email already registered to the system.'
			});
		}
		const requiredFields = ['email', 'password', 'phone_number', 'first_name', 'last_name'];
		for (let i = 0; i < requiredFields.length; i++) {
			if (!req.body.hasOwnProperty(requiredFields[i])) {
				return res.status(400).json({
					error: 'Bad Request',
					message: `The request body must contain ${requiredFields[i]}!`
				});
			}
		}

		const customer = await CustomerService.create(req.body);
		return res.status(200).json(customer);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const update = async (req, res) => {
	try {
		if (req.body && Object.keys(req.body).length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}
		if (req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a customer!'
			});
		}
		req.body.customer_id = req.customer_id;
		const customer = await CustomerService.update(req.body);
		return res.status(200).json(customer);
	} catch (error) {
		console.error(error.message);

		return res.status(500).json({
			error: 'Internal server error',
			message: err.message
		});
	}
};

const get = async (req, res) => {
	try {
		const customer = await CustomerService.get(req.params.customer_id);

		if (!customer) {
			console.error(`Customer not found`);
			return res.status(404).json({
				error: 'Not Found',
				message: `Customer not found`
			});
		}
		return res.status(200).json(customer);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			error: 'Internal Server Error',
			message: error.message
		});
	}
};

const remove = async (req, res) => {
	return res.status(404).json({ message: 'Customer removal is not possible at the moment.' });
};

const login = async (req, res) => {
	try {
		if (!req.body.hasOwnProperty('email')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a email property'
			});
		}

		if (!req.body.hasOwnProperty('password')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a password property'
			});
		}

		const token = await CustomerService.login(req.body.email, req.body.password);
		if (token) {
			return res.status(200).json({ token });
		} else {
			return res.status(404).json({
				error: 'Customer Not Found',
				message: 'Customer Not Found'
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

module.exports = {
	create,
	get,
	update,
	remove,
	login
};
