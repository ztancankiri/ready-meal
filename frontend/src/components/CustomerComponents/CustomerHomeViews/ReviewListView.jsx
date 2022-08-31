import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customerSelector } from '../../../redux/customer/CustomerReducer';
import { getReservations } from '../../../redux/customer/CustomerReservationActions';
import { getReviewsByCustomerId } from '../../../redux/customer/CustomerReviewActions';

import ReservationView from './ReservationView';

const ReviewListView = () => {
	const dispatch = useDispatch();

	const customer = useSelector(customerSelector);
	const customerReservations = customer.reservation.all;

	useEffect(() => {
		if (customer.single._id) {
			dispatch(getReservations(customer.single._id));
			dispatch(getReviewsByCustomerId(customer.single._id));
		}
	}, [dispatch, customer.single._id]);

	return (
		<Paper sx={{ maxHeight: 400, overflow: 'auto', mt: 2 }}>
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
					})
					.slice(0, 5)}
		</Paper>
	);
};

export default ReviewListView;
