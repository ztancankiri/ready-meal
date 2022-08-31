'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CustomerService = require('./CustomerService');
const ReservationService = require('./ReservationService');

const isCustomerStripeUser = async customer_id => {
	try {
		const customer = await CustomerService.get(customer_id);
		return customer.stripe_customer_id && customer.stripe_payment_method_id ? true : false;
	} catch (error) {
		throw error;
	}
};

const createStripeUser = async reservation_id => {
	try {
		const reservation = await ReservationService.get(reservation_id);

		if (!reservation) {
			console.error('createStripeUser: No reservation!');
			return null;
		}

		let customer = await CustomerService.get(reservation.customer_id);

		if (!customer) {
			console.error('createStripeUser: No customer!');
			return null;
		}

		if (!customer.stripe_customer_id) {
			const stripeUser = await stripe.customers.create({
				email: customer.email
			});

			customer.stripe_customer_id = stripeUser.id;
			customer.customer_id = reservation.customer_id;
			customer = await CustomerService.update(customer);
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'setup',
			customer: customer.stripe_customer_id,
			success_url: process.env.STRIPE_SUCCESS_ENDPOINT,
			cancel_url: process.env.STRIPE_CANCEL_ENDPOINT,
			client_reference_id: reservation_id
		});

		return { stripe_url: session.url };
	} catch (error) {
		throw error;
	}
};

const createPaymentIntent = async (customer_id, amount) => {
	try {
		const customer = await CustomerService.get(customer_id);

		if (!customer.stripe_customer_id || !customer.stripe_payment_method_id) {
			return null;
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: 'eur',
			payment_method_types: ['card'],
			capture_method: 'manual',
			payment_method: customer.stripe_payment_method_id,
			customer: customer.stripe_customer_id,
			off_session: true,
			confirm: true
		});

		return paymentIntent.id;
	} catch (error) {
		throw error;
	}
};

const capturePayment = async (payment_intent_id, amount) => {
	try {
		const intent = await stripe.paymentIntents.capture(payment_intent_id, {
			amount_to_capture: amount
		});
		return intent;
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const cancelPayment = async payment_intent_id => {
	try {
		const intent = await stripe.paymentIntents.cancel(payment_intent_id);
		return intent;
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

const refundPayment = async payment_intent_id => {
	try {
		const refund = await stripe.refunds.create({
			payment_intent: payment_intent_id
		});
		return refund;
	} catch (error) {
		console.error(`Stripe Error: ${error.message}`);
		return res.status(400).send(`Error: ${error.message}`);
	}
};

module.exports = {
	isCustomerStripeUser,
	createStripeUser,
	createPaymentIntent,
	capturePayment,
	cancelPayment,
	refundPayment
};
