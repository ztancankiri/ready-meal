import { useEffect, useState } from 'react';
import moment from 'moment';
import RestaurantMenuMealView from './RestaurantViews/RestaurantMenuMealView';
import CalendarNavigatorView from './ReservationViews/CalendarNavigatorView';
import { Button, TextField, Grid, Autocomplete, IconButton, Stack, Box, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';

import { Add, ShoppingBasket, Remove, CalendarMonth, AccessTime, People, Fastfood, Sell } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector } from '../redux/restaurant/RestaurantReducer';
import { getFoodsByRestaurant } from '../redux/restaurant/RestaurantFoodActions';
import { getRestaurant } from '../redux/restaurant/RestaurantActions';
import { createReservation } from '../redux/customer/CustomerReservationActions';
import { customerSelector } from '../redux/customer/CustomerReducer';

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

const Menu = () => {
	const { restaurant_id } = useParams();
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const restaurant = useSelector(restaurantSelector);
	const allFoods = restaurant.food.all;
	const customer = useSelector(customerSelector).single;
	const payment = useSelector(customerSelector).payment;

	const [orders, setOrders] = useState(restaurant.food.all);
	const [openReserve, setOpenReserve] = useState(false);
	const [selected, setSelected] = useState({ id: null, date: new Date() });
	const [selectedTime, setSelectedTime] = useState('14:00');

	const [peopleCount, setPeopleCount] = useState(0);
	const [filterValue, setFilterValue] = useState('');

	const decreasePeopleCount = () => {
		if (peopleCount > 0) {
			setPeopleCount(peopleCount - 1);
		}
	};
	const increasePeopleCount = () => {
		setPeopleCount(peopleCount + 1);
	};

	const addOrder = meal => {
		setOrders(
			orders.map(order => {
				if (order._id === meal._id) {
					return { ...order, count: (order.count ?? 0) + 1 };
				} else {
					return order;
				}
			})
		);
	};

	const removeOrder = meal => {
		setOrders(
			orders.map(order => {
				if (order._id === meal._id) {
					return { ...order, count: (order.count ?? 0) - 1 };
				} else {
					return order;
				}
			})
		);
	};

	const filterChanged = e => {
		setFilterValue(e.target.value.trim());
	};

	const handleClose = () => {
		setOpenReserve(false);
	};

	const handlePay = () => {
		const filteredOrder = [];
		for (let i = 0; i < orders.length; i++) {
			if (orders[i].count && orders[i].count > 0) {
				for (let j = 0; j < orders[i].count; j++) {
					filteredOrder.push(orders[i]);
				}
			}
		}
		const time = new Date(moment(`${moment(selected.date).format('DD/MM/YYYY')} ${selectedTime}`, 'DD/MM/YYYY HH:mm'));
		dispatch(
			createReservation({
				customer_id: customer._id,
				reservation: {
					restaurant_id: restaurant_id,
					number_of_people: peopleCount,
					foods: filteredOrder,
					time: time
				}
			})
		);
	};

	const handleReserveOpen = () => {
		if (peopleCount > 0 && orders.filter(order => order?.count > 0)?.length > 0 && selectedTime) {
			setOpenReserve(true);
		}
	};

	useEffect(() => {
		dispatch(getRestaurant(restaurant_id));
		dispatch(getFoodsByRestaurant(restaurant_id));
	}, [dispatch, restaurant_id]);

	useEffect(() => {
		setOrders(allFoods);
	}, [allFoods]);

	useEffect(() => {
		if (payment && payment.stripe_url) {
			window.location.replace(payment.stripe_url);
		} else if (payment && payment.stripe_payment_intent_id) {
			setOpenReserve(false);
			window.location.replace('/customer/home');
		}
	}, [payment]);

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
				<h1>{restaurant.single.restaurant_name}</h1>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
					<Grid
						container
						direction={{
							xs: 'column',
							sm: 'column',
							md: 'row',
							lg: 'row',
							xl: 'row'
						}}
						sx={{ mt: 2 }}
						justifyContent={{
							xs: 'center',
							sm: 'center',
							md: 'left',
							lg: 'left',
							xl: 'left'
						}}
						alignItems='center'>
						<TextField id='filter-restaurant-dishes' value={filterValue} onChange={filterChanged} label='Search meals and ingredients' sx={{ width: 220, mr: 2, mb: 2 }} />
						<Stack sx={{ mr: 2, mb: 2 }} direction='row' spacing={1} justifyContent='center' alignItems='center'>
							<Typography variant='body2'></Typography>
							<CalendarNavigatorView selectionHandler={{ selected, setSelected }} />
						</Stack>
						<Autocomplete
							disablePortal
							id='combo-box-time'
							value={selectedTime}
							onChange={(event, newValue) => setSelectedTime(newValue)}
							options={['12:00', '14:00', '16:00', '18:00', '20:00']}
							sx={{ width: 220, mr: 2, mb: 2 }}
							renderInput={params => <TextField {...params} label='Pick a time slot' />}
						/>
						<Box component='span' m={1} sx={{ mr: 2, mb: 2 }} display='flex' justifyContent='space-between' alignItems='center'>
							<Typography variant='body2'>Number of people:</Typography>
							<IconButton color='primary' aria-label='add an alarm' sx={{ height: 'auto' }} onClick={decreasePeopleCount}>
								<Remove />
							</IconButton>
							{peopleCount}
							<IconButton color='primary' aria-label='add an alarm' sx={{ height: 'auto' }} onClick={increasePeopleCount}>
								<Add />
							</IconButton>
						</Box>
					</Grid>
					<Button variant='contained' color='success' startIcon={<ShoppingBasket />} onClick={handleReserveOpen}>
						Reserve
					</Button>
				</Stack>
				{Array.isArray(allFoods) ? (
					allFoods.map(meal => {
						if (
							filterValue === '' ||
							meal.name.toLowerCase().includes(filterValue.toLowerCase()) ||
							meal.ingredients.filter(ingredient => ingredient.toLowerCase().includes(filterValue.toLowerCase())).length > 0
						) {
							return <RestaurantMenuMealView key={meal._id} meal={meal} addOrder={addOrder} removeOrder={removeOrder} />;
						} else {
							return <></>;
						}
					})
				) : (
					<></>
				)}
				<Dialog open={openReserve} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
					<DialogContent>
						<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
							<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
								Reservation Details
							</Typography>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
								<CalendarMonth />
								<Typography>{moment(selected.date).format('DD/MM/YYYY')}</Typography>
							</Stack>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
								<AccessTime />
								<Typography>{selectedTime}</Typography>
							</Stack>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
								<People />
								<Typography>{peopleCount} People</Typography>
							</Stack>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
								<Fastfood />
								<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={15}>
									<Stack direction='column' spacing={1}>
										{orders.map(order => {
											if (order.count && order.count > 0) {
												return (
													<Typography key={`food-${order._id}`}>
														{order.count} x {order.name}
													</Typography>
												);
											}
											return <></>;
										})}
									</Stack>
									<Stack direction='column' spacing={1}>
										{orders.map(order => {
											if (order.count && order.count > 0) {
												return (
													<Typography key={`food-price-${order._id}`} align='right'>
														€ {parseFloat((order.price * order.count) / 100).toFixed(2)}
													</Typography>
												);
											}
											return <></>;
										})}
									</Stack>
								</Stack>
							</Stack>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
								<Sell />
								<Typography align='right'>
									€{' '}
									{parseFloat(
										orders.reduce((accumulator, object) => {
											if (object.count) return accumulator + object.price * object.count;
											return accumulator;
										}, 0) / 100
									).toFixed(2)}
								</Typography>
							</Stack>
							<DialogActions sx={{ width: '100%' }}>
								<Button onClick={handlePay} variant='contained' autoFocus>
									Continue to Pay
								</Button>
								<Button onClick={handleClose} variant='outlined'>
									Close
								</Button>
							</DialogActions>
						</Stack>
					</DialogContent>
				</Dialog>
			</Item>
		</ThemeProvider>
	);
};

export default Menu;
