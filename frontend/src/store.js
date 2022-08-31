import { configureStore } from '@reduxjs/toolkit';

import customerReducer from './redux/customer/CustomerReducer';
import restaurantReducer from './redux/restaurant/RestaurantReducer';

export default configureStore({
	reducer: {
		customer: customerReducer,
		restaurant: restaurantReducer
	}
});
