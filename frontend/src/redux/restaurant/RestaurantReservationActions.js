import { createAsyncThunk } from '@reduxjs/toolkit';
import RestaurantService from '../../services/RestaurantService';
import CustomerService from '../../services/CustomerService';
import HttpService from '../../services/HttpService';

export const getReservationsByRestaurant = createAsyncThunk('restaurant/reservation/getReservationsByRestaurant', async (_, thunkAPI) => {
	try {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const restaurant_id = HttpService.extractUser(token).restaurant_id;

			const response = await RestaurantService.getReservationsByRestaurant(restaurant_id);

			for (let i = 0; i < response.data.length; i++) {
				const reservation = response.data[i];
				if (reservation.customer_id) {
					try {
						const customer_response = await CustomerService.get(reservation.customer_id);
						reservation.customer = customer_response.data;
						delete reservation['customer_id'];
					} catch (e) {
						console.error('[Reservation]: Customer Fetch: ' + e.message);
					}
				}
			}

			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const approveReservation = createAsyncThunk('restaurant/reservation/approveReservation', async ({ reservation_id, reservation }, thunkAPI) => {
	try {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const restaurant_id = HttpService.extractUser(token).restaurant_id;

			const captureResponse = await RestaurantService.captureReservation(restaurant_id, reservation_id);

			const response = await RestaurantService.updateReservation(restaurant_id, reservation_id, reservation);

			window.location.replace('/restaurant/reservations');

			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const completeReservation = createAsyncThunk('restaurant/reservation/approveReservation', async ({ reservation_id, reservation }, thunkAPI) => {
	try {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const restaurant_id = HttpService.extractUser(token).restaurant_id;

			const response = await RestaurantService.updateReservation(restaurant_id, reservation_id, reservation);

			window.location.replace('/restaurant/reservations');

			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const cancelReservation = createAsyncThunk('restaurant/reservation/approveReservation', async ({ reservation_id, reservation }, thunkAPI) => {
	try {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const restaurant_id = HttpService.extractUser(token).restaurant_id;

			const refundResponse = await RestaurantService.refundReservation(restaurant_id, reservation_id);

			const response = await RestaurantService.updateReservation(restaurant_id, reservation_id, reservation);

			window.location.replace('/restaurant/reservations');

			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const rejectReservation = createAsyncThunk('restaurant/reservation/rejectReservation', async ({ reservation_id, reservation }, thunkAPI) => {
	try {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const restaurant_id = HttpService.extractUser(token).restaurant_id;

			const cancelResponse = await RestaurantService.cancelReservation(restaurant_id, reservation_id);

			const response = await RestaurantService.updateReservation(restaurant_id, reservation_id, reservation);

			window.location.replace('/restaurant/reservations');

			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});
