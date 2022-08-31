import LoginIcon from '@mui/icons-material/Login';
import { Stack, Paper, Button, CardMedia, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../resources/logo.png';

const LoginCustomer = () => {
	const navigate = useNavigate();

	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '10%', py: 3, px: 3, width: { xs: '60%', md: '30%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={3} direction='column' justifyContent='center'>
				<Typography color='#1976d2' align='center' variant='h6' align-items='center' gutterBottom component='div'>
					Welcome to ReadyMeal!
				</Typography>

				<Typography align='center' variant='h6' align-items='center' gutterBottom component='body2' sx={{ fontFamily: '"Helvetica Neue"' }}>
					ReadyMeal, is an online platform to help restaurant customers reserve a table in a restaurant and eliminate their waiting time for meal preparation with a vast selection of
					available meals prepared in advance for their reservations.
				</Typography>

				<Stack spacing={1} direction='row' justifyContent='center'>
					<Button variant='contained' startIcon={<LoginIcon />} onClick={() => window.location.replace(`/customer/login`)}>
						Continue as Customer
					</Button>
					<Button variant='contained' startIcon={<LoginIcon />} onClick={() => window.location.replace(`/restaurant/login`)}>
						Continue as Restaurant
					</Button>
				</Stack>
			</Stack>
		</Paper>
	);
};

export default LoginCustomer;
