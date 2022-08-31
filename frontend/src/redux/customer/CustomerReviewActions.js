import { createAsyncThunk } from '@reduxjs/toolkit';
import CustomerService from '../../services/CustomerService';

export const createReview = createAsyncThunk('customer/review/createReview', async ({ customer_id, review }, thunkAPI) => {
	try {
		const response = await CustomerService.createReview(customer_id, review);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const getReviewsByCustomerId = createAsyncThunk('customer/review/getReviewsByCustomerId', async (customer_id, thunkAPI) => {
	try {
		const response = await CustomerService.getReviewsByCustomerId(customer_id);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});
