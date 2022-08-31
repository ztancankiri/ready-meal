import { createAsyncThunk } from '@reduxjs/toolkit';
import CustomerService from '../../services/CustomerService';
import HttpService from '../../services/HttpService';

export const registerCustomer = createAsyncThunk('customer/registerCustomer', async ({ email, password, name, lastname, phone }, thunkAPI) => {
	try {
		await CustomerService.register(email, password, name, lastname, phone);
		return {};
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const loginCustomer = createAsyncThunk('customer/login', async ({ email, password }, thunkAPI) => {
	try {
		const response = await CustomerService.login(email, password);
		localStorage.setItem('jwtToken', response.data.token);
		let customer_id = response.user.is_restaurant ? response.user.restaurant_id : response.user.customer_id;
		return { _id: customer_id, is_restaurant: response.user.is_restaurant, isLoggedIn: true };
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const getCustomer = createAsyncThunk('customer/getCustomer', async (customer_id, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			if (!customer_id) {
				customer_id = HttpService.extractUser(localStorage.getItem('jwtToken')).customer_id;
			}
			const response = await CustomerService.get(customer_id);
			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const updateCustomer = createAsyncThunk('customer/update', async ({ customer_id, updatedCustomer }, thunkAPI) => {
	try {
		const response = await CustomerService.update(customer_id, updatedCustomer);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});
