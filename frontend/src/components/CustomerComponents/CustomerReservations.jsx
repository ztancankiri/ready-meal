import { Box, Paper } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customerSelector } from '../../redux/customer/CustomerReducer';
import { getReservations } from '../../redux/customer/CustomerReservationActions';
import { getReviewsByCustomerId } from '../../redux/customer/CustomerReviewActions';

import ReservationView from './CustomerHomeViews/ReservationView';
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

const CustomerReservations = () => {
	const dispatch = useDispatch();

	const customer = useSelector(customerSelector);
	const customerReservations = customer.reservation.all;

	useEffect(() => {
		if (customer.single._id) {
			dispatch(getReservations(customer.single._id));
			dispatch(getReviewsByCustomerId(customer.single._id));
		}
	}, [customer.single._id]);

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
				<Paper sx={{ overflow: 'auto', my: 2 }}>
					{Array.isArray(customerReservations) &&
						[...customerReservations]
							.sort((x, y) => {
								if (x.time > y.time) {
									return -1;
								} else if (x.time < y.time) {
									return 1;
								} else {
									return 0;
								}
							})
							.map(reservation => {
								return <ReservationView key={reservation._id} reservation={reservation} />;
							})}
				</Paper>
			</Item>
		</ThemeProvider>
	);
};

export default CustomerReservations;
