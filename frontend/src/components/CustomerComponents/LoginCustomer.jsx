import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import { Stack, TextField, Paper, Button, CardMedia, Link, Typography, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../resources/logo.png';
import { customerSelector } from '../../redux/customer/CustomerReducer';
import { loginCustomer } from '../../redux/customer/CustomerActions';
const LoginCustomer = () => {
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const customer = useSelector(customerSelector);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [open, setOpen] = useState(false);

	const login = () => {
		dispatch(loginCustomer({ email, password }));
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		if (customer.single.isLoggedIn) {
			window.location.replace(`/customer/home`);
		} else if (!customer.isFetching && customer.isError) {
			setOpen(true);
		}
	}, [customer, navigate]);
	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '10%', py: 3, px: 3, width: { xs: '40%', md: '20%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={1} direction='column' justifyContent='center'>
				<Typography color='#1976d2' align='center' variant='h6' align-items='center' gutterBottom component='div'>
					Customer Login
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
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={6000} onClose={handleClose}>
					<Alert severity='error' sx={{ width: '100%' }} onClose={handleClose}>
						{customer?.errorMessage?.message}
					</Alert>
				</Snackbar>
				<Button variant='contained' endIcon={<LoginIcon />} onClick={login}>
					Login
				</Button>
				<Link component='button' variant='body2' onClick={() => window.location.replace(`/restaurant/login`)}>
					Login For Restaurant
				</Link>
				<Link component='button' variant='body2' onClick={() => window.location.replace(`/customer/register`)}>
					Create an Account
				</Link>
				{/* <Link component='button' variant='body2' onClick={() => window.location.replace(`/forgot-password`)}>
					Forgot Password?
				</Link> */}
			</Stack>
		</Paper>
	);
};

export default LoginCustomer;
