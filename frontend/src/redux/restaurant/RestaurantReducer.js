import { createSlice } from '@reduxjs/toolkit';
import { registerRestaurant, loginRestaurant, getRestaurant, updateRestaurant, getAllRestaurants } from './RestaurantActions';
import { getFoodsByRestaurant, createFood, updateFood, deleteFood } from './RestaurantFoodActions';
import { approveReservation, rejectReservation, getReservationsByRestaurant, cancelReservation, completeReservation } from './RestaurantReservationActions';

export const restaurantSlice = createSlice({
	name: 'restaurant',
	initialState: {
		all: [],
		single: {
			_id: '',
			email: '',
			password: '',
			phone_number: '',
			address_street: '',
			address_number: '',
			address_code: '',
			address_city: '',
			photo: '',
			restaurant_name: '',
			number_of_tables: 0,
			discount_ratio: 0
		},
		food: {
			all: [],
			single: {
				_id: '',
				name: '',
				price: '',
				ingredients: [],
				photo: ''
			}
		},
		reservation: {
			all: [],
			single: {
				_id: '',
				customer_id: '',
				restaurant_id: '',
				number_of_people: '',
				foods: [],
				reservation_status: '',
				time: '',
				table_number: '',
				stripe_payment_intent_id: '',
				discount_ratio: ''
			}
		},
		isFetching: false,
		isSuccess: false,
		isError: false,
		errorMessage: '',
		isLoggedIn: false
	},
	reducers: {
		clearState: state => {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		},
		logout: () => {
			localStorage.removeItem('jwtToken');

			return {
				all: [],
				single: {
					_id: '',
					email: '',
					password: '',
					phone_number: '',
					address_street: '',
					address_number: '',
					address_code: '',
					address_city: '',
					photo: '',
					restaurant_name: '',
					number_of_tables: 0,
					discount_ratio: 0
				},
				food: {
					all: [],
					single: {
						_id: '',
						name: '',
						price: '',
						ingredients: [],
						photo: ''
					}
				},
				reservation: {
					all: [],
					single: {
						_id: '',
						customer_id: '',
						restaurant_id: '',
						number_of_people: '',
						foods: [],
						reservation_status: '',
						time: '',
						table_number: '',
						stripe_payment_intent_id: '',
						discount_ratio: ''
					}
				},
				isFetching: false,
				isSuccess: false,
				isError: false,
				errorMessage: '',
				isLoggedIn: false
			};
		}
	},
	extraReducers: {
		[registerRestaurant.fulfilled]: (state, { payload }) => {
			state.isFetching = false;
			state.isSuccess = true;
		},
		[registerRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[registerRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[loginRestaurant.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[loginRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[loginRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[updateRestaurant.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[updateRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[updateRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[getRestaurant.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[getAllRestaurants.fulfilled]: (state, { payload }) => {
			state.all = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getAllRestaurants.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getAllRestaurants.pending]: state => {
			state.isFetching = true;
		},
		[getFoodsByRestaurant.fulfilled]: (state, { payload }) => {
			state.food.all = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getFoodsByRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getFoodsByRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[getReservationsByRestaurant.fulfilled]: (state, { payload }) => {
			state.reservation.all = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getReservationsByRestaurant.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getReservationsByRestaurant.pending]: state => {
			state.isFetching = true;
		},
		[approveReservation.fulfilled]: state => {
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[approveReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[approveReservation.pending]: state => {
			state.isFetching = true;
		},
		[cancelReservation.fulfilled]: state => {
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[cancelReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[cancelReservation.pending]: state => {
			state.isFetching = true;
		},
		[completeReservation.fulfilled]: state => {
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[completeReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[completeReservation.pending]: state => {
			state.isFetching = true;
		},
		[rejectReservation.fulfilled]: state => {
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[rejectReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[rejectReservation.pending]: state => {
			state.isFetching = true;
		},
		[createFood.fulfilled]: (state, { payload }) => {
			state.food.all.push(payload);
			state.isFetching = false;
			state.isSuccess = true;
		},
		[createFood.pending]: state => {
			state.isFetching = true;
		},
		[createFood.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[updateFood.fulfilled]: state => {
			state.isFetching = false;
			state.isSuccess = true;
		},
		[updateFood.pending]: state => {
			state.isFetching = true;
		},
		[updateFood.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[deleteFood.fulfilled]: (state, { payload }) => {
			state.food.all = state.food.all.filter(item => item._id !== payload._id);
			state.isFetching = false;
			state.isSuccess = true;
		},
		[deleteFood.pending]: state => {
			state.isFetching = true;
		},
		[deleteFood.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		}
	}
});

export const { clearState, logout } = restaurantSlice.actions;

export const restaurantSelector = state => state.restaurant;

export default restaurantSlice.reducer;
