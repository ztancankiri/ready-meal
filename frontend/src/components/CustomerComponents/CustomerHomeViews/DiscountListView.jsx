import { useEffect, useState } from 'react';

import { IconButton, Stack } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import DiscountView from './DiscountView';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector } from '../../../redux/restaurant/RestaurantReducer';
import { getAllRestaurants } from '../../../redux/restaurant/RestaurantActions';

const DiscountListView = () => {
	const dispatch = useDispatch();
	const restaurants = useSelector(restaurantSelector).all;

	useEffect(() => {
		dispatch(getAllRestaurants());
	}, [dispatch]);

	useEffect(() => {
		if (restaurants && restaurants.length !== 0) {
			const filteredRestaurants = restaurants.filter(restaurant => restaurant.discount_ratio !== 0);
			setDiscountedRestaurants(filteredRestaurants);
		}
	}, [restaurants]);

	const [discountedRestaurants, setDiscountedRestaurants] = useState([]);
	const [index, setIndex] = useState(0);
	const previousDiscounts = () => {
		if (index > 0) {
			setIndex(index - 1);
		}
	};

	const nextDiscounts = () => {
		if (index < discountedRestaurants.length - 3) {
			setIndex(index + 1);
		}
	};

	return (
		<Stack justifyContent='center' direction='row' alignItems='center' spacing={2} sx={{ mt: 2 }}>
			<IconButton color='primary' onClick={previousDiscounts}>
				<ArrowLeftIcon />
			</IconButton>
			{discountedRestaurants.slice(index, index + 3).map(restaurant => {
				return <DiscountView restaurant={restaurant} key={restaurant._id} />;
			})}
			<IconButton color='primary' onClick={nextDiscounts}>
				<ArrowRightIcon />
			</IconButton>
		</Stack>
	);
};

export default DiscountListView;
