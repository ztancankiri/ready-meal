import { useEffect, useState } from 'react';
import WaitingReservationView from './ReservationViews/WaitingReservationView';
import CalendarNavigatorView from './ReservationViews/CalendarNavigatorView';
import CalendarView from './ReservationViews/CalendarView';
import { Box, Button } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux';
import { getReservationsByRestaurant } from '../redux/restaurant/RestaurantReservationActions';
import { restaurantSelector } from '../redux/restaurant/RestaurantReducer';
import { getRestaurant } from '../redux/restaurant/RestaurantActions';

const theme = responsiveFontSizes(createTheme());

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%',
	display: 'block'
}));

const Reservations = () => {
	const [selected, setSelected] = useState({ id: null, date: new Date() });

	const restaurant = useSelector(restaurantSelector).single;
	const reservations = useSelector(restaurantSelector).reservation.all;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getRestaurant());
		dispatch(getReservationsByRestaurant());
	}, [dispatch, reservations.filter(item => item.reservation_status === 1).length]);

	return (
		<ThemeProvider theme={theme}>
			<Item
				sx={{
					textAlign: {
						xs: 'center',
						sm: 'center',
						md: 'left',
						lg: 'left',
						xl: 'left'
					},
					ml: 2,
					mt: 2,
					mr: 5
				}}>
				<h1>Reservations</h1>
				<WaitingReservationView selectionHandler={{ selected, setSelected }} reservations={reservations} />
				{reservations && reservations.filter(item => item.reservation_status === 1).length > 0 ? (
					<Button sx={{ mt: 2 }} variant='contained' onClick={() => setSelected({ ...selected, id: null })}>
						Deselect
					</Button>
				) : (
					<></>
				)}
				<CalendarNavigatorView selectionHandler={{ selected, setSelected }} reservations={reservations} disablePast={false} />
				<CalendarView selectionHandler={{ selected, setSelected }} reservations={reservations} restaurant={restaurant} />
			</Item>
		</ThemeProvider>
	);
};

export default Reservations;
