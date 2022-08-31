import { createSlice } from '@reduxjs/toolkit';
import { registerCustomer, loginCustomer, getCustomer, updateCustomer } from './CustomerActions';
import { createReservation, getReservations, payReservation } from './CustomerReservationActions';
import { createReview, getReviewsByCustomerId } from './CustomerReviewActions';

export const customerSlice = createSlice({
	name: 'customer',
	initialState: {
		all: [],
		single: {
			_id: '',
			first_name: '',
			last_name: '',
			email: '',
			phone_number: '',
			errorMessage: '',
			isLoggedIn: false
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
		review: { all: [] },
		payment: {},
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
					first_name: '',
					last_name: '',
					email: '',
					phone_number: '',
					errorMessage: '',
					isLoggedIn: false
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
				review: { all: [] },
				payment: {},
				isFetching: false,
				isSuccess: false,
				isError: false,
				errorMessage: '',
				isLoggedIn: false
			};
		}
	},
	extraReducers: {
		[registerCustomer.fulfilled]: (state, { payload }) => {
			state.isFetching = false;
			state.isSuccess = true;
		},
		[registerCustomer.pending]: state => {
			state.isFetching = true;
		},
		[registerCustomer.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[loginCustomer.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[loginCustomer.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[loginCustomer.pending]: state => {
			state.isFetching = true;
		},
		[updateCustomer.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[updateCustomer.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[updateCustomer.pending]: state => {
			state.isFetching = true;
		},
		[getCustomer.fulfilled]: (state, { payload }) => {
			state.single = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getCustomer.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getCustomer.pending]: state => {
			state.isFetching = true;
		},
		[getReservations.fulfilled]: (state, { payload }) => {
			state.reservation.all = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getReservations.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getReservations.pending]: state => {
			state.isFetching = true;
		},
		[createReservation.fulfilled]: (state, { payload }) => {
			state.payment = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[createReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[createReservation.pending]: state => {
			state.isFetching = true;
		},
		[payReservation.fulfilled]: (state, { payload }) => {
			state.payment = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[payReservation.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[payReservation.pending]: state => {
			state.isFetching = true;
		},
		[getReviewsByCustomerId.fulfilled]: (state, { payload }) => {
			state.review.all = payload;
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[getReviewsByCustomerId.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[getReviewsByCustomerId.pending]: state => {
			state.isFetching = true;
		},
		[createReview.fulfilled]: (state, { payload }) => {
			state.review.all.push(payload);
			state.isFetching = false;
			state.isSuccess = true;
			return state;
		},
		[createReview.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload.message;
		},
		[createReview.pending]: state => {
			state.isFetching = true;
		}
	}
});

export const { clearState, logout } = customerSlice.actions;

export const customerSelector = state => state.customer;

export default customerSlice.reducer;
