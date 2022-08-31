import { createAsyncThunk } from '@reduxjs/toolkit';
import RestaurantService from '../../services/RestaurantService';
import HttpService from '../../services/HttpService';

export const registerRestaurant = createAsyncThunk('restaurant/registerRestaurant', async ({ restaurant, photo }, thunkAPI) => {
	try {
		const response = await RestaurantService.register(restaurant);
		if (photo) {
			await RestaurantService.uploadRestaurantPhoto(response.data._id, photo);
		}
		return {};
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const loginRestaurant = createAsyncThunk('restaurant/login', async ({ email, password }, thunkAPI) => {
	try {
		const response = await RestaurantService.login(email, password);
		localStorage.setItem('jwtToken', response.data.token);
		const restaurant_id = response.user.is_restaurant ? response.user.restaurant_id : response.user.restaurant_id;
		return { _id: restaurant_id, is_restaurant: response.user.is_restaurant, isLoggedIn: true };
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const getRestaurant = createAsyncThunk('restaurant/getRestaurant', async (restaurant_id, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			if (!restaurant_id) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			}
			const response = await RestaurantService.get(restaurant_id);
			return response.data;
		}
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const updateRestaurant = createAsyncThunk('restaurant/update', async ({ restaurant_id, updatedRestaurant }, thunkAPI) => {
	try {
		const response = await RestaurantService.update(restaurant_id, updatedRestaurant);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const getAllRestaurants = createAsyncThunk('restaurant/getAllRestaurants', async (_, thunkAPI) => {
	try {
		const response = await RestaurantService.get();
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const uploadRestaurantPhoto = createAsyncThunk('restaurant/uploadFoodPhoto', async (photo, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			const is_restaurant = HttpService.extractUser(localStorage.getItem('jwtToken')).is_restaurant;

			let restaurant_id;
			if (is_restaurant) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			} else {
				return thunkAPI.rejectWithValue({ message: 'Error' });
			}
			const response = await RestaurantService.uploadRestaurantPhoto(restaurant_id, photo);
			if (response.status === 200) {
				return { ...response.data };
			} else {
				return thunkAPI.rejectWithValue(response);
			}
		}
	} catch (e) {
		thunkAPI.rejectWithValue({ message: e });
	}
});
