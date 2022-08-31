import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Dialog, DialogContent, Button, DialogActions } from '@mui/material';
import moment from 'moment';

import lines from '../../resources/lines.png';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleIcon from '@mui/icons-material/People';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SellIcon from '@mui/icons-material/Sell';
import TableBarIcon from '@mui/icons-material/TableBar';

import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector } from '../../redux/restaurant/RestaurantReducer';
import { approveReservation, cancelReservation, completeReservation } from '../../redux/restaurant/RestaurantReservationActions';

const style_cell = {
	borderLeft: 1,
	borderTop: 1,
	borderRight: 1,
	borderBottom: 1,
	borderColor: 'transparent',
	textAlign: 'center',
	width: 'auto',
	px: 2,
	py: 2
};

const style_disable_selection = {
	'-webkit-touch-callout': 'none',
	'-webkit-user-select': 'none',
	'-khtml-user-select': 'none',
	'-moz-user-select': 'none',
	'-ms-user-select': 'none',
	'user-select': 'none'
};

const style_cell_text = {
	...style_disable_selection,
	color: 'transparent'
};

const hourMap = {
	'08:00': 1,
	'10:00': 2,
	'12:00': 3,
	'14:00': 4,
	'16:00': 5,
	'18:00': 6,
	'20:00': 7,
	'22:00': 8
};

const CalendarView = props => {
	const [selected, setSelected] = useState(null);
	const [occupied, setOccupied] = useState(Array.isArray(props.reservations) ? props.reservations.filter(item => item.table_number).map(item => `1-${item.table_number}`) : []);
	const [dimensions, setDimensions] = useState({ col: 0, row: 9 });
	const [selectedRow, setSelectedRow] = useState(null);
	const [reservationCellMap, setReservationCellMap] = useState(null);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [selectedTable, setSelectedTable] = useState(null);
	const [openDetails, setOpenDetails] = useState(false);

	const dispatch = useDispatch();
	const restaurant = useSelector(restaurantSelector);

	const zeroPad = (num, places) => String(num).padStart(places, '0');

	const getRowImage = row => {
		if (selectedRow && row !== selectedRow) {
			return `url(${lines})`;
		} else {
			return null;
		}
	};

	const getCellColor = (row, col, hover = false) => {
		const index = `${row}-${col}`;

		if (selectedRow) {
			if (selectedRow === row) {
				if (selected === index) {
					return hover ? '#00FF00FF' : '#00FF00A0';
				} else if (occupied.includes(index)) {
					return '#FF0000A0';
				} else {
					return hover ? '#D5D5D5FF' : 'transparent';
				}
			}
		}

		if (occupied.includes(index)) {
			if (reservationCellMap[index].reservation_status === 2) {
				return hover ? '#FF0000FF' : '#FF0000A0';
			} else if (reservationCellMap[index].reservation_status === 5) {
				return hover ? '#0000FFFF' : '#0000FFA0';
			}
		}
	};

	const getTimeText = row => {
		return `${zeroPad(8 + (row - 1) * 2, 2)}:00 - ${zeroPad(8 + row * 2, 2)}:00`;
	};

	const getCellCursor = (row, col) => {
		const index = `${row}-${col}`;

		if (selectedRow) {
			if (selectedRow === row) {
				if (!occupied.includes(index)) {
					return 'pointer';
				}
			}
		} else {
			if (occupied.includes(index)) {
				return 'pointer';
			}
		}

		return null;
	};

	const dialogButtonHandle = ok => {
		setOpenDetails(false);
		if (ok) {
			const reservation_id = selectedReservation._id;
			const reservation = {
				table_number: selectedTable,
				reservation_status: 2
			};

			dispatch(approveReservation({ reservation_id, reservation }));
		}
	};

	const dialogCancelButtonHandle = () => {
		setOpenDetails(false);

		const reservation_id = selectedReservation._id;
		const reservation = {
			reservation_status: 3
		};

		dispatch(cancelReservation({ reservation_id, reservation }));
	};

	const dialogCompleteButtonHandle = () => {
		setOpenDetails(false);

		const reservation_id = selectedReservation._id;
		const reservation = {
			reservation_status: 5
		};

		dispatch(completeReservation({ reservation_id, reservation }));
	};

	const selectCell = (row, col) => {
		setSelected(`${row}-${col}`);
	};

	const cellClick = (row, col, occupied = false) => {
		if (occupied) {
			setSelectedReservation(reservationCellMap[`${row}-${col}`]);
			setOpenDetails(true);
		} else {
			setSelectedReservation(props.reservations.filter(item => item._id === props.selectionHandler.selected.id)[0]);
			setSelectedTable(col);
			setOpenDetails(true);
		}
	};

	const cellClickHandler = (row, col) => {
		const index = `${row}-${col}`;

		if (selectedRow) {
			if (selectedRow === row) {
				if (!occupied.includes(index)) {
					selectCell(row, col);
					cellClick(row, col);
				}
			}
		} else {
			if (occupied.includes(index)) {
				cellClick(row, col, true);
			}
		}
	};

	useEffect(() => {
		setDimensions({ col: props.restaurant?.number_of_tables + 1 ?? 0, row: 9 });

		const tmp_occupied = [];
		const tmp_map = {};

		if (Array.isArray(props.reservations) && props.reservations.length > 0) {
			const filtered = props.reservations.filter(
				item => (item.reservation_status === 2 || item.reservation_status === 5) && moment(item.time).format('DD/MM/YYYY') === moment(props.selectionHandler.selected.date).format('DD/MM/YYYY')
			);

			for (let i = 0; i < filtered.length; i++) {
				const item = filtered[i];

				const hour = moment(item.time).format('HH:mm');
				const row = hourMap[hour];
				const col = item.table_number;
				tmp_occupied.push(`${row}-${col}`);
				tmp_map[`${row}-${col}`] = item;
			}
		}

		setOccupied(tmp_occupied);
		setReservationCellMap(tmp_map);
	}, [props.selectionHandler.selected, props.restaurant, props.reservations]);

	useEffect(() => {
		if (Array.isArray(props.reservations) && props.reservations.length > 0 && props.selectionHandler.selected.id) {
			const selected = props.reservations.filter(item => item._id === props.selectionHandler.selected.id)[0];
			const hour = moment(selected.time).format('HH:mm');
			const row = hourMap[hour];
			setSelectedRow(row);
			selectCell(null);
		} else {
			setSelectedRow(null);
			setSelected(null);
		}
	}, [props.selectionHandler.selected, props.reservations]);

	useEffect(() => {
		if (!props.selectionHandler.selected.id) {
			setSelectedTable(null);
		}
	}, [props.selectionHandler.selected.id]);

	let foods = [];

	for (let index = 0; selectedReservation && index < selectedReservation.foods.length; index++) {
		const food = selectedReservation.foods[index];
		const existingFood = foods.find(item => item._id === food._id);
		if (existingFood) {
			existingFood.count = existingFood.count + 1;
		} else {
			foods.push({ ...food, count: 1 });
		}
	}

	return (
		<Stack justifyContent='center' direction='row' alignItems='center'>
			<Box sx={{ width: 1000, textAlign: 'center', mt: 3, overflowX: 'scroll' }}>
				<Stack direction='row' alignItems='center' sx={{ textAlign: 'center', mt: 3 }}>
					<Stack direction='row'>
						{Array.from(Array(dimensions.col)).map((_, col) => (
							<Stack direction='column' key={`col-${col}`}>
								{Array.from(Array(dimensions.row)).map((_, row) => {
									if (row === 0 && col === 0) {
										// Top Left Cell.
										return (
											<Box key={'cell-' + row + '-' + col} sx={style_cell}>
												<Typography key={'cell-body-' + row + '-' + col} sx={style_cell_text} noWrap>
													.
												</Typography>
											</Box>
										);
									} else if (row === 0 && col !== 0) {
										// Tables Row
										return (
											<Box key={'cell-' + row + '-' + col} sx={style_cell}>
												<Typography key={'cell-body-' + row + '-' + col} sx={style_disable_selection} noWrap>
													Table-{col}
												</Typography>
											</Box>
										);
									} else if (row !== 0 && col === 0) {
										// Times Column
										return (
											<Box key={'cell-' + row + '-' + col} sx={style_cell}>
												<Typography key={'cell-body-' + row + '-' + col} sx={style_disable_selection} noWrap>
													{getTimeText(row)}
												</Typography>
											</Box>
										);
									} else {
										// Grid Cells
										return (
											<Box
												key={'cell-' + row + '-' + col}
												sx={{
													...style_cell,
													borderColor: 'black',
													borderRight: col === dimensions.col - 1 ? 1 : 0,
													borderBottom: row === dimensions.row - 1 ? 1 : 0,
													'&:hover':
														!selectedRow || row === selectedRow
															? {
																	background: getCellColor(row, col, true),
																	cursor: getCellCursor(row, col)
															  }
															: {},
													background: getCellColor(row, col),
													backgroundImage: getRowImage(row),
													backgroundSize: 'cover'
												}}
												onClick={() => cellClickHandler(row, col)}>
												<Typography key={'cell-body-' + row + '-' + col} sx={style_cell_text} noWrap>
													.
												</Typography>
											</Box>
										);
									}
								})}
							</Stack>
						))}
					</Stack>
				</Stack>
			</Box>
			<Dialog open={openDetails} onClose={() => dialogButtonHandle(false)} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogContent>
					<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
						<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
							{selectedTable ? 'Do you approve this reservation?' : 'Reservation Details'}
						</Typography>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<AccountBoxIcon />
							<Typography>
								{selectedReservation?.customer?.first_name} {selectedReservation?.customer?.last_name}
							</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<CalendarMonthIcon />
							<Typography>{selectedReservation && selectedReservation.time ? moment(selectedReservation.time).format('DD/MM/YYYY') : ''}</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<AccessTimeIcon />
							<Typography>
								{selectedReservation && selectedReservation.time
									? `${moment(selectedReservation.time).format('HH:mm')} - ${moment(selectedReservation.time).add(2, 'hours').format('HH:mm')}`
									: ''}
							</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<PeopleIcon />
							<Typography>{selectedReservation?.noOfPeople} People</Typography>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<FastfoodIcon />
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={15}>
								<Stack direction='column' spacing={1}>
									{foods ? (
										foods.map(food => {
											return (
												<Typography key={`food-${food._id}`}>
													{food.count} x {food.name}
												</Typography>
											);
										})
									) : (
										<></>
									)}
								</Stack>
								<Stack direction='column' spacing={1}>
									{foods ? (
										foods.map(food => {
											return (
												<Typography key={`food-price-${food._id}`} align='right'>
													€ {parseFloat((food.price * food.count) / 100).toFixed(2)}
												</Typography>
											);
										})
									) : (
										<></>
									)}
								</Stack>
							</Stack>
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<SellIcon />
							{selectedReservation ? (
								<Typography align='right'>
									€{' '}
									{parseFloat(
										selectedReservation.foods.reduce((accumulator, object) => {
											return accumulator + object.price;
										}, 0) / 100
									).toFixed(2)}
								</Typography>
							) : (
								<></>
							)}
						</Stack>
						<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
							<TableBarIcon />
							<Typography sx={{ color: 'red' }}>Table {selectedTable ? selectedTable : selectedReservation?.table_number}</Typography>
						</Stack>
						<DialogActions sx={{ width: '100%' }}>
							{selectedTable ? (
								<Button onClick={() => dialogButtonHandle(true)} variant='contained'>
									Yes, approve it.
								</Button>
							) : (
								<></>
							)}

							{selectedReservation && selectedReservation.reservation_status === 5 ? (
								<>
									<Button onClick={() => dialogButtonHandle(false)} variant='outlined'>
										Close
									</Button>
								</>
							) : selectedReservation && selectedReservation.reservation_status === 2 ? (
								<>
									<Button onClick={() => dialogCompleteButtonHandle()} variant='contained'>
										Complete
									</Button>
									<Button onClick={() => dialogCancelButtonHandle()} variant='contained' color='secondary'>
										Cancel
									</Button>
									<Button onClick={() => dialogButtonHandle(false)} variant='outlined'>
										Close
									</Button>
								</>
							) : (
								<></>
							)}
						</DialogActions>
					</Stack>
				</DialogContent>
			</Dialog>
		</Stack>
	);
};

export default CalendarView;
