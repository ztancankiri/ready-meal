'use strict';

const ReservationModel = require('../models/ReservationModel');
const ReservationStatus = require('../models/ReservationStatusEnum');

const create = async data => {
	try {
		const reservation_body = Object.assign(data, {
			customer_id: data.customer_id,
			reservation_status: ReservationStatus.CREATED //use enum in model class
		});

		return await ReservationModel.create(reservation_body);
	} catch (error) {
		throw error;
	}
};

const update = async data => {
	try {
		// find and update reservation with id
		let reservation;
		if (data.restaurant_id) {
			reservation = await ReservationModel.findOneAndUpdate({ _id: data.reservation_id, restaurant_id: data.restaurant_id }, data, {
				new: true,
				runValidators: true
			}).exec();
		} else {
			reservation = await ReservationModel.findOneAndUpdate({ _id: data.reservation_id, customer_id: data.customer_id }, data, {
				new: true,
				runValidators: true
			}).exec();
		}
		// return updated reservation
		return reservation;
	} catch (error) {
		throw error;
	}
};

const get = async (reservationId, data) => {
	try {
		let reservation;
		if (data) {
			reservation = await ReservationModel.findById(reservationId).select(data.join(' ')).exec();
		} else {
			reservation = await ReservationModel.findById(reservationId).exec();
		}

		return reservation;
	} catch (error) {
		throw error;
	}
};

const find = async filter => {
	try {
		let reservations;
		if (filter) {
			reservations = await ReservationModel.find(filter);
		} else {
			reservations = await ReservationModel.find();
		}

		return reservations;
	} catch (error) {
		throw error;
	}
};

const exists = async data => {
	try {
		let Reservation = await ReservationModel.exists(data);
		return Reservation;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	create,
	update,
	get,
	exists,
	find
};
