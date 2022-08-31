import { Paper, RadioGroup, Typography } from '@mui/material';

import ReservationTableRowView from './ReservationTableRowView';
import moment from 'moment';

const WaitingReservationView = props => {
	const rowHandle = event => {
		props.selectionHandler.setSelected({ date: props.reservations.filter(item => item._id === event.target.value)[0].time, id: event.target.value });
	};

	return (
		<RadioGroup value={props.selectionHandler.selected.id} onChange={rowHandle}>
			<Paper sx={{ maxHeight: 200, overflow: 'auto', mt: 2 }}>
				{Array.isArray(props.reservations) ? (
					props.reservations
						.filter(item => item.reservation_status === 1)
						.map(reservation => {
							return (
								<ReservationTableRowView
									key={reservation._id}
									customer={`${reservation.customer.first_name} ${reservation.customer.last_name}`}
									date={moment(reservation.time).format('DD/MM/YYYY')}
									time={`${moment(reservation.time).format('HH:mm')} - ${moment(reservation.time).add(2, 'hours').format('HH:mm')}`}
									noOfPeople={reservation.number_of_people}
									foods={reservation.foods}
									id={reservation._id}
									selectionHandler={props.selectionHandler}
								/>
							);
						})
				) : (
					<Typography>There are no waiting reservations!</Typography>
				)}
			</Paper>
		</RadioGroup>
	);
};

export default WaitingReservationView;
