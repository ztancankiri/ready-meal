import { createAsyncThunk } from '@reduxjs/toolkit';
import RestaurantService from '../../services/RestaurantService';
import HttpService from '../../services/HttpService';

export const getFoodsByRestaurant = createAsyncThunk('restaurant/food/getFoodsByRestaurant', async (restaurant_id, thunkAPI) => {
	try {
		const response = await RestaurantService.getFoodsByRestaurant(restaurant_id);
		return response.data;
	} catch (e) {
		return thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const createFood = createAsyncThunk('restaurant/food/createFood', async ({ food, photo }, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			const is_restaurant = HttpService.extractUser(localStorage.getItem('jwtToken')).is_restaurant;

			let restaurant_id;
			if (is_restaurant) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			} else {
				return thunkAPI.rejectWithValue({ message: 'Error' });
			}
			const response = await RestaurantService.createFood(restaurant_id, food);
			if (photo) {
				await RestaurantService.uploadFoodPhoto(restaurant_id, response.data._id, photo);
			}
			return response.data;
		}
	} catch (e) {
		thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const updateFood = createAsyncThunk('restaurant/food/updateFood', async ({ food_id, food }, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			const is_restaurant = HttpService.extractUser(localStorage.getItem('jwtToken')).is_restaurant;

			let restaurant_id;
			if (is_restaurant) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			} else {
				return thunkAPI.rejectWithValue({ message: 'Error' });
			}
			const response = await RestaurantService.updateFood(restaurant_id, food_id, food);
			if (response.status === 200) {
				return { ...response.data };
			} else {
				return thunkAPI.rejectWithValue(response);
			}
		}
	} catch (e) {
		thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const deleteFood = createAsyncThunk('restaurant/food/deleteFood', async (food, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			const is_restaurant = HttpService.extractUser(localStorage.getItem('jwtToken')).is_restaurant;

			let restaurant_id;
			if (is_restaurant) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			} else {
				return thunkAPI.rejectWithValue({ message: 'Error' });
			}
			const response = await RestaurantService.deleteFood(restaurant_id, food);
			if (response.status === 200) {
				return { ...response.data };
			} else {
				return thunkAPI.rejectWithValue(response);
			}
		}
	} catch (e) {
		thunkAPI.rejectWithValue({ message: e.response.data });
	}
});

export const uploadFoodPhoto = createAsyncThunk('restaurant/food/uploadFoodPhoto', async ({ food_id, photo }, thunkAPI) => {
	try {
		if (localStorage.getItem('jwtToken') && localStorage.getItem('jwtToken') !== undefined) {
			const is_restaurant = HttpService.extractUser(localStorage.getItem('jwtToken')).is_restaurant;

			let restaurant_id;
			if (is_restaurant) {
				restaurant_id = HttpService.extractUser(localStorage.getItem('jwtToken')).restaurant_id;
			} else {
				return thunkAPI.rejectWithValue({ message: 'Error' });
			}
			const response = await RestaurantService.uploadFoodPhoto(restaurant_id, food_id, photo);
			if (response.status === 200) {
				return { ...response.data };
			} else {
				return thunkAPI.rejectWithValue(response);
			}
		}
	} catch (e) {
		thunkAPI.rejectWithValue({ message: e.response.data });
	}
});
