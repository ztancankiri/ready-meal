import { createAsyncThunk } from '@reduxjs/toolkit';
import CustomerService from '../../services/CustomerService';

export const createReservation = createAsyncThunk('customer/reservation/createReservation', async ({ customer_id, reservation }, thunkAPI) => {
	try {
		const response = await CustomerService.createReservation(customer_id, reservation);
		const reservation_id = response?.data?._id;

		if (reservation_id) {
			const paymentResponse = await CustomerService.payReservation(customer_id, reservation_id);
			return paymentResponse.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const getReservations = createAsyncThunk('customer/reservation/getReservations', async (customer_id, thunkAPI) => {
	try {
		const response = await CustomerService.getReservation(customer_id);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const payReservation = createAsyncThunk('customer/reservation/payReservation', async ({ customer_id, reservation_id }, thunkAPI) => {
	try {
		const paymentResponse = await CustomerService.payReservation(customer_id, reservation_id);
		return paymentResponse.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});
