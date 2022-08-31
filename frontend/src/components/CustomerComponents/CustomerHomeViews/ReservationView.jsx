import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Stack, Button, Typography, Divider, Rating, Dialog, DialogContent, DialogActions, TextField, IconButton, Paper } from '@mui/material';

import { CalendarMonth, AccessTime, Restaurant, RateReview, Info, People, Fastfood, Sell } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector } from '../../../redux/restaurant/RestaurantReducer';
import { getAllRestaurants, getRestaurant } from '../../../redux/restaurant/RestaurantActions';
import { createReview } from '../../../redux/customer/CustomerReviewActions';
import { customerSelector } from '../../../redux/customer/CustomerReducer';

import { payReservation } from '../../../redux/customer/CustomerReservationActions';

const ReservationView = props => {
	const dispatch = useDispatch();
	const restaurants = useSelector(restaurantSelector).all;
	const reviews = useSelector(customerSelector).review.all;

	const payment = useSelector(customerSelector).payment;
	const { reservation } = props;

	const [open, setOpen] = useState(false);
	const [openDetails, setOpenDetails] = useState(false);
	const [reviewComment, setReviewComment] = useState('');
	const [reviewGrade, setReviewGrade] = useState(3);
	const [reviewFiltered, setReviewFiltered] = useState([]);

	const [restaurant, setRestaurant] = useState({});

	let foods = [];

	for (let index = 0; reservation && index < reservation.foods.length; index++) {
		const food = reservation.foods[index];
		const existingFood = foods.find(item => item._id === food._id);
		if (existingFood) {
			existingFood.count = existingFood.count + 1;
		} else {
			foods.push({ ...food, count: 1 });
		}
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setReviewComment('');
		setReviewGrade(3);
	};

	const handleReview = () => {
		dispatch(
			createReview({
				customer_id: reservation.customer_id,
				review: { reservation_id: reservation._id, restaurant_id: reservation.restaurant_id, grade: reviewGrade, comment: reviewComment }
			})
		);
		setOpen(false);
	};

	const handlePay = () => {
		dispatch(payReservation({ customer_id: reservation.customer_id, reservation_id: reservation._id }));
	};

	const getColorByStatus = status => {
		switch (status) {
			case 0:
			case 3:
			case 4:
				return 'red';
			case 1:
				return 'orange';
			case 2:
			case 5:
				return 'green';
			default:
				return 'green';
		}
	};

	const getMessageByStatus = status => {
		switch (status) {
			case 0:
				return 'Payment Failed';
			case 1:
				return 'Pending';
			case 2:
				return 'Approved';
			case 3:
				return 'Cancelled';
			case 4:
				return 'Rejected';
			case 5:
				return 'Completed';
			default:
				return 'black';
		}
	};

	const handleCancleReservation = () => {
		console.log('cancel');
	};

	useEffect(() => {
		dispatch(getAllRestaurants());
	}, [dispatch]);

	useEffect(() => {
		let tempReviewFiltered = [];
		for (let i = 0; i < reviews.length; i++) {
			if (reviews[i].reservation_id === reservation._id) {
				tempReviewFiltered.push(reviews[i]);
			}
		}
		setReviewFiltered(tempReviewFiltered);
	}, [reviews]);

	useEffect(() => {
		console.log(restaurants);
		for (let i = 0; i < restaurants.length; i++) {
			if (restaurants[i]._id === reservation.restaurant_id) {
				setRestaurant(restaurants[i]);
				break;
			}
		}
	}, [restaurants]);

	useEffect(() => {
		if (payment && payment.stripe_url) {
			window.location.replace(payment.stripe_url);
		} else if (payment && payment.stripe_payment_intent_id) {
			window.location.replace('/customer/home');
		}
	}, [payment]);

	return (
		<>
			<Box
				sx={{
					maxHeight: 200,
					overflow: 'auto',
					px: 3,
					my: 1
				}}>
				<Stack
					justifyContent='space-between'
					direction={{
						xs: 'column',
						sm: 'column',
						md: 'row',
						lg: 'row',
						xl: 'row'
					}}
					alignItems='center'>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<Restaurant />
						<Typography>{restaurant.restaurant_name}</Typography>
					</Stack>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<CalendarMonth />
						<Typography>{moment(reservation.time).format('DD/MM/YYYY')}</Typography>
					</Stack>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<AccessTime />
						<Typography>{`${moment(reservation.time).format('HH:mm')}`}</Typography>
					</Stack>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						{reservation.reservation_status === 5 ? (
							Array.isArray(reviewFiltered) && reviewFiltered.length > 0 ? (
								reviewFiltered.map(review => {
									return <Rating name='half-rating-read' key={review._id} defaultValue={parseFloat(review.grade)} precision={0.5} readOnly />;
								})
							) : (
								<Button variant='contained' startIcon={<RateReview />} onClick={handleOpen}>
									Review Now
								</Button>
							)
						) : (
							<></>
						)}
					</Stack>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							},
							my: 1,
							mx: 1
						}}>
						{reservation.reservation_status === 0 ? (
							<Button variant='contained' color='error' onClick={handlePay}>
								Try paying again
							</Button>
						) : (
							<Paper variant='outlined' sx={{ bgcolor: getColorByStatus(reservation.reservation_status), color: 'white', p: 1 }}>
								{getMessageByStatus(reservation.reservation_status)}
							</Paper>
						)}
					</Stack>
					<Stack
						direction={{
							xs: 'row',
							sm: 'row',
							md: 'column',
							lg: 'column',
							xl: 'column'
						}}
						alignItems='center'
						sx={{
							width: {
								xs: '100%',
								sm: '100%',
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<IconButton color='primary' onClick={() => setOpenDetails(true)}>
							<Info />
						</IconButton>
					</Stack>
				</Stack>
			</Box>
			<Divider />
			<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogContent>
					<Stack direction='column' spacing={2}>
						<Stack direction='column'>
							<Stack direction='row'>
								<Restaurant />
								<Typography>{restaurant.restaurant_name}</Typography>
							</Stack>
							<Stack direction='row'>
								<CalendarMonth />
								<Typography>{moment(reservation.time).format('DD/MM/YYYY')}</Typography>
							</Stack>
							<Stack direction='row'>
								<AccessTime />
								<Typography>{moment(reservation.time).format('HH:mm')}</Typography>
							</Stack>
						</Stack>
						<Stack direction='column'>
							<TextField id='outlined-multiline-flexible' label='Add a Review' multiline value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
						</Stack>
						<Stack justifyContent='center' alignItems='center'>
							<Rating name='half-rating-read' value={reviewGrade} onChange={(e, newValue) => setReviewGrade(newValue)} precision={0.5} size='large' />
						</Stack>

						<DialogActions sx={{ width: '100%' }}>
							<Button variant='contained' onClick={handleReview} autoFocus>
								Submit
							</Button>
							<Button onClick={handleClose} variant='outlined' autoFocus>
								Close
							</Button>
						</DialogActions>
					</Stack>
				</DialogContent>
			</Dialog>
			<Dialog open={openDetails} onClose={() => setOpenDetails(false)} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogContent>
					<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
						<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
							Reservation Details
						</Typography>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<CalendarMonth />
							<Typography>{moment(reservation.time).format('DD/MM/YYYY')}</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<AccessTime />
							<Typography>{moment(reservation.time).format('HH:mm')}</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<People />
							<Typography>{reservation.number_of_people} People</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<Fastfood />
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={15}>
								<Stack direction='column' spacing={1}>
									{foods.map(food => {
										return (
											<Typography key={`food-${food._id}`}>
												{food.count} x {food.name}
											</Typography>
										);
									})}
								</Stack>
								<Stack direction='column' spacing={1}>
									{foods.map(food => {
										return (
											<Typography key={`food-price-${food._id}`} align='right'>
												€ {parseFloat((food.price * food.count) / 100).toFixed(2)}
											</Typography>
										);
									})}
								</Stack>
							</Stack>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<Sell />
							<Typography align='right'>
								€{' '}
								{parseFloat(
									reservation.foods.reduce((accumulator, object) => {
										return accumulator + object.price;
									}, 0) / 100
								).toFixed(2)}
							</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<CalendarMonth />
							<Typography>{moment(reservation.time).format('DD/MM/YYYY')}</Typography>
						</Stack>
						<DialogActions sx={{ width: '100%' }}>
							<Button onClick={() => setOpenDetails(false)} variant='outlined'>
								Close
							</Button>
						</DialogActions>
					</Stack>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ReservationView;
