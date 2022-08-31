import { useState } from 'react';

import { Stack, Box, Divider, Dialog, DialogContent, Button, Typography, DialogActions, IconButton, Radio } from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleIcon from '@mui/icons-material/People';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SellIcon from '@mui/icons-material/Sell';
import { useDispatch } from 'react-redux';
import { rejectReservation } from '../../redux/restaurant/RestaurantReservationActions';

const styleDirection = {
	xs: 'row',
	sm: 'row',
	md: 'column',
	lg: 'column',
	xl: 'column'
};

const ReservationTableRowView = props => {
	const [openDetails, setOpenDetails] = useState(false);
	const [isDeny, setIsDeny] = useState(false);
	const dispatch = useDispatch();

	const handleClickOpenDetails = isDenyButton => {
		setIsDeny(isDenyButton);
		setOpenDetails(true);
	};

	const dialogButtonHandle = ok => {
		setOpenDetails(false);

		if (ok) {
			const reservation_id = props.id;
			const reservation = {
				reservation_status: 4
			};

			dispatch(rejectReservation({ reservation_id, reservation }));
		}
	};

	let foods = [];

	for (let index = 0; index < props.foods.length; index++) {
		const food = props.foods[index];
		const existingFood = foods.find(item => item._id === food._id);
		if (existingFood) {
			existingFood.count = existingFood.count + 1;
		} else {
			foods.push({ ...food, count: 1 });
		}
	}

	return (
		<>
			<Box
				sx={{
					maxHeight: 200,
					overflow: 'auto',
					px: 3,
					my: 1,
					'&:hover': {
						background: '#D5D5D5'
					},
					background: props.id === props.selectionHandler.selected.id ? '#F9E076' : 'transparent'
				}}>
				<Stack justifyContent='space-between' direction={{ xs: 'column', md: 'row' }} alignItems='center'>
					<Stack
						direction={styleDirection}
						alignItems='center'
						sx={{
							width: {
								md: '5%',
								lg: '5%',
								xl: '5%'
							}
						}}>
						<Radio value={props.id} />
					</Stack>
					<Stack
						direction={styleDirection}
						alignItems='center'
						sx={{
							width: {
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<AccountBoxIcon />
						<Typography>{props.customer}</Typography>
					</Stack>
					<Stack
						direction={styleDirection}
						alignItems='center'
						sx={{
							width: {
								md: '20%',
								lg: '20%',
								xl: '20%'
							}
						}}>
						<CalendarMonthIcon />
						<Typography>{props.date}</Typography>
					</Stack>
					<Stack
						direction={styleDirection}
						alignItems='center'
						sx={{
							width: {
								md: '25%',
								lg: '25%',
								xl: '25%'
							}
						}}>
						<AccessTimeIcon />
						<Typography>{props.time}</Typography>
					</Stack>
					<Stack direction='row' spacing={1}>
						<IconButton color='primary' onClick={() => handleClickOpenDetails(false)}>
							<InfoIcon />
						</IconButton>
						<IconButton color='secondary' onClick={() => handleClickOpenDetails(true)}>
							<CancelIcon />
						</IconButton>
						<Dialog open={openDetails} onClose={() => dialogButtonHandle(false)} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogContent>
								<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
									<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
										{isDeny ? `Do you want to reject the following reservation?` : `Reservation Details`}
									</Typography>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<AccountBoxIcon />
										<Typography>{props.customer}</Typography>
									</Stack>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<CalendarMonthIcon />
										<Typography>{props.date}</Typography>
									</Stack>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<AccessTimeIcon />
										<Typography>{props.time}</Typography>
									</Stack>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<PeopleIcon />
										<Typography>{props.noOfPeople} People</Typography>
									</Stack>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<FastfoodIcon />
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
															€ {parseFloat(food.price / 100).toFixed(2)}
														</Typography>
													);
												})}
											</Stack>
										</Stack>
									</Stack>
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<SellIcon />
										<Typography align='right'>
											€{' '}
											{parseFloat(
												props.foods.reduce((accumulator, object) => {
													return accumulator + object.price;
												}, 0) / 100
											).toFixed(2)}
										</Typography>
									</Stack>
									<DialogActions sx={{ width: '100%' }}>
										{isDeny ? (
											<>
												<Button onClick={() => dialogButtonHandle(true)} variant='contained' autoFocus>
													Yes, reject it.
												</Button>
												<Button onClick={() => dialogButtonHandle(false)} variant='outlined'>
													No, keep it.
												</Button>
											</>
										) : (
											<Button onClick={() => dialogButtonHandle(false)} variant='outlined'>
												Close
											</Button>
										)}
									</DialogActions>
								</Stack>
							</DialogContent>
						</Dialog>
					</Stack>
				</Stack>
			</Box>
			<Divider />
		</>
	);
};

export default ReservationTableRowView;
