import { Box, IconButton, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import enLocale from 'date-fns/locale/en-GB';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const CalendarNavigatorView = props => {
	const previousDay = () => {
		const yesterday = new Date(props.selectionHandler.selected.date);
		yesterday.setDate(yesterday.getDate() - 1);
		props.selectionHandler.setSelected({ id: null, date: yesterday });
	};

	const nextDay = () => {
		const tomorrow = new Date(props.selectionHandler.selected.date);
		tomorrow.setDate(tomorrow.getDate() + 1);
		props.selectionHandler.setSelected({ id: null, date: tomorrow });
	};

	return (
		<Box sx={{ textAlign: 'center', mt: 3 }}>
			<Stack justifyContent='center' direction='row' alignItems='center'>
				<IconButton color='primary' onClick={previousDay}>
					<ArrowLeftIcon />
				</IconButton>
				<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
					<DatePicker
						disablePast={props.disablePast}
						value={props.selectionHandler.selected.date}
						onChange={newValue => {
							props.selectionHandler.setSelected({ id: null, date: new Date(newValue) });
						}}
						renderInput={params => <TextField {...params} sx={{ width: 150 }} />}
					/>
				</LocalizationProvider>
				<IconButton color='primary' onClick={nextDay}>
					<ArrowRightIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};

export default CalendarNavigatorView;
