'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/CustomerModel');

const create = async data => {
	try {
		data.password = bcrypt.hashSync(data.password, 8);
		// find and update customer with id
		const customer = await CustomerModel.create(data);

		// return created customer
		return customer;
	} catch (error) {
		throw error;
	}
};

const get = async (customer_id, data) => {
	try {
		let customer;
		if (data) {
			customer = await CustomerModel.findById(customer_id).select(data.join(' ')).exec();
		} else {
			customer = await CustomerModel.findById(customer_id).exec();
		}

		if (customer) customer.password = undefined;
		return customer;
	} catch (error) {
		throw error;
	}
};

const update = async data => {
	try {
		// find and update customer with id
		if (data.password) {
			data.password = bcrypt.hashSync(data.password, 8);
		}
		const customer = await CustomerModel.findByIdAndUpdate(data.customer_id, data, {
			new: true,
			runValidators: true
		}).exec();

		if (customer) customer.password = undefined;
		// return updated customer
		return customer;
	} catch (error) {
		throw error;
	}
};

const remove = async customer_id => {
	try {
		// find and delete customer with id
		const customer = await CustomerModel.findByIdAndDelete(customer_id).exec();

		// return deleted customer
		return customer;
	} catch (error) {
		throw error;
	}
};

const login = async (email, password) => {
	try {
		const customer = await CustomerModel.findOne({ email: email }).exec();

		// check if the password is valid
		if (!customer || !bcrypt.compareSync(password, customer.password)) {
			return null;
		}

		const token = jwt.sign({ customer_id: customer._id, is_restaurant: false }, process.env.JWT_SECRET, {
			expiresIn: process.env.AUTH_TOKEN_EXPIRE_TIME
		});

		return token;
	} catch (error) {
		throw error;
	}
};

const exists = async data => {
	try {
		let customer = await CustomerModel.exists(data);
		return customer;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
	get,
	update,
	remove,
	login,
	exists
};
