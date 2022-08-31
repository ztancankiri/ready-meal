import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import { Stack, TextField, Paper, Button, CardMedia, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../resources/logo.png';
import { restaurantSelector } from '../../redux/restaurant/RestaurantReducer';
import { loginRestaurant } from '../../redux/restaurant/RestaurantActions';
const LoginRestaurant = () => {
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const restaurant = useSelector(restaurantSelector).single;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const login = () => {
		dispatch(loginRestaurant({ email, password }));
	};

	useEffect(() => {
		if (restaurant.isLoggedIn) {
			window.location.replace(`/restaurant/reservations`);
		}
	}, [restaurant, navigate]);
	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '10%', py: 3, px: 3, width: { xs: '40%', md: '20%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={1} direction='column' justifyContent='center'>
				<Typography color='#1976d2' align='center' variant='h6' align-items='center' gutterBottom component='div'>
					Restaurant Login
				</Typography>
				<TextField
					label='E-mail'
					value={email}
					onChange={e => {
						setEmail(e.target.value);
					}}
				/>
				<TextField
					label='Password'
					type={'password'}
					value={password}
					onChange={e => {
						setPassword(e.target.value);
					}}
				/>
				<Button variant='contained' endIcon={<LoginIcon />} onClick={login}>
					Login
				</Button>
				<Link component='button' variant='body2' onClick={() => window.location.replace(`/customer/login`)}>
					Login For Customer
				</Link>
				<Link component='button' variant='body2' onClick={() => window.location.replace(`/restaurant/register`)}>
					Create a Restaurant
				</Link>
				{/* <Link component='button' variant='body2' onClick={forgotPassword}>
					Forgot Password?
				</Link> */}
			</Stack>
		</Paper>
	);
};

export default LoginRestaurant;
