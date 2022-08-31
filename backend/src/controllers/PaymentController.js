'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentService = require('../services/PaymentService');
const CustomerService = require('../services/CustomerService');
const ReservationService = require('../services/ReservationService');
const ReservationStatusEnum = require('../models/ReservationStatusEnum');

const webhook = async (req, res) => {
	try {
		const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_ENDPOINT_SECRET);

		// Handle the event
		if (event.type === 'payment_intent.created') {
			console.log(`RECEIVED: payment_intent.created: ${new Date().getTime()}`);
		} else if (event.type === 'customer.created') {
			console.log(`RECEIVED: customer.created: ${new Date().getTime()}`);
		} else if (event.type === 'payment_intent.succeeded') {
			console.log(`RECEIVED: payment_intent.succeeded: ${new Date().getTime()}`);
		} else if (event.type === 'charge.succeeded') {
			console.log(`RECEIVED: charge.succeeded: ${new Date().getTime()}`);
		} else if (event.type === 'checkout.session.completed') {
			console.log(`RECEIVED: checkout.session.completed: ${new Date().getTime()}`);
		} else if (event.type === 'setup_intent.created') {
			console.log(`RECEIVED: setup_intent.created: ${new Date().getTime()}`);
		} else if (event.type === 'setup_intent.succeeded') {
			console.log(`RECEIVED: setup_intent.succeeded: ${new Date().getTime()}`);
		} else if (event.type === 'payment_method.attached') {
			try {
				console.log(`RECEIVED: payment_method.attached: ${new Date().getTime()}`);

				const sessions = await stripe.checkout.sessions.list({
					limit: 1,
					customer: event.data.object.customer
				});

				const reservation_id = sessions.data[0].client_reference_id;
				const reservation = await ReservationService.get(reservation_id);

				if (reservation) {
					let customer = await CustomerService.get(reservation.customer_id);

					if (customer) {
						customer.stripe_user_id = event.data.object.customer;
						customer.stripe_payment_method_id = event.data.object.id;
						customer.customer_id = reservation.customer_id;
						customer = await CustomerService.update(customer);

						let amount = 0;
						for (let i = 0; i < reservation.foods.length; i++) {
							const food = reservation.foods[i];
							amount += food.price;
						}
						if (reservation.discount_ratio > 0) {
							amount *= (100 - reservation.discount_ratio) / 100;
						}

						const paymentIntentId = await PaymentService.createPaymentIntent(reservation.customer_id, amount);

						if (paymentIntentId) {
							reservation.stripe_payment_intent_id = paymentIntentId;
							reservation.reservation_status = ReservationStatusEnum.PENDING;

							reservation.reservation_id = reservation_id;
							await ReservationService.update(reservation);
						}
					}
				}
			} catch (error) {
				console.error(`Stripe Error: ${error.message}`);
			}
		} else if (event.type === 'payment_intent.amount_capturable_updated') {
			console.log(`RECEIVED: payment_intent.amount_capturable_updated: ${new Date().getTime()}`);
		} else if (event.type === 'charge.captured') {
			console.log(`RECEIVED: charge.captured: ${new Date().getTime()}`);
		} else {
			console.error(`Unhandled event type ${event.type}: ${new Date().getTime()}`);
		}

		// Return a 200 response to Stripe to acknowledge receipt of the event.
		return res.status(200).json({ success: true });
	} catch (err) {
		console.error(`Webhook Error: ${err.message}`);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}
};

const pay = async (req, res) => {
	try {
		if (req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a customer!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		let amount = 0;
		for (let i = 0; i < reservation.foods.length; i++) {
			const food = reservation.foods[i];
			amount += food.price;
		}
		if (reservation.discount_ratio > 0) {
			amount *= (100 - reservation.discount_ratio) / 100;
		}

		// Case 1: Stripe User created. Redirection URL returned.
		if (!(await PaymentService.isCustomerStripeUser(req.customer_id))) {
			const url = await PaymentService.createStripeUser(reservation_id);
			return url
				? res.status(200).json(url)
				: res.status(404).send({
						error: 'Not exist',
						message: 'Model with given id does not exist'
				  });
		}

		// Case 2: Stripe User exists. Reservation with payment_intent_id returned.
		const paymentIntentId = await PaymentService.createPaymentIntent(req.customer_id, amount);

		if (paymentIntentId) {
			let reservation = await ReservationService.get(reservation_id);
			reservation.stripe_payment_intent_id = paymentIntentId;
			reservation.reservation_status = ReservationStatusEnum.PENDING;

			reservation.reservation_id = reservation_id;
			reservation = await ReservationService.update(reservation);
			return res.status(200).json(reservation);
		} else {
			console.error(`Stripe Error: Payment intent could not be created.`);
			return res.status(400).send(`Error: Payment intent could not be created.`);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const capture = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		let amount = 0;
		for (let i = 0; i < reservation.foods.length; i++) {
			const food = reservation.foods[i];
			amount += food.price;
		}
		if (reservation.discount_ratio > 0) {
			amount *= (100 - reservation.discount_ratio) / 100;
		}

		if (reservation && reservation.stripe_payment_intent_id) {
			const intent = await PaymentService.capturePayment(reservation.stripe_payment_intent_id, amount);
			return res.status(200).json(intent);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const cancel_restaurant = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		if (reservation && reservation.stripe_payment_intent_id) {
			const intent = await PaymentService.cancelPayment(reservation.stripe_payment_intent_id);
			return res.status(200).json(intent);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const cancel_customer = async (req, res) => {
	try {
		if (req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a customer!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		if (reservation && reservation.stripe_payment_intent_id) {
			const intent = await PaymentService.cancelPayment(reservation.stripe_payment_intent_id);
			return res.status(200).json(intent);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const refund_restaurant = async (req, res) => {
	try {
		if (!req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a restaurant!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		if (reservation && reservation.stripe_payment_intent_id) {
			const intent = await PaymentService.refundPayment(reservation.stripe_payment_intent_id);
			return res.status(200).json(intent);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const refund_customer = async (req, res) => {
	try {
		if (req.is_restaurant) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'You are not a customer!'
			});
		}

		const reservation_id = req.params.reservation_id;
		const reservation = await ReservationService.get(reservation_id);

		if (reservation && reservation.stripe_payment_intent_id) {
			const intent = await PaymentService.refundPayment(reservation.stripe_payment_intent_id);
			return res.status(200).json(intent);
		}
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

module.exports = {
	webhook,
	pay,
	capture,
	cancel_restaurant,
	cancel_customer,
	refund_restaurant,
	refund_customer
};
