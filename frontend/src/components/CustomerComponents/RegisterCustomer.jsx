import { useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import { Stack, TextField, Paper, Button, CardMedia, Link, FormControl, OutlinedInput, InputAdornment, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../resources/logo.png';
import { registerCustomer } from '../../redux/customer/CustomerActions';
const RegisterCustomer = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const alreadyRegistered = () => {
		window.location.replace(`/customer/login`);
	};

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [phone, setPhone] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleClickOpen = () => {
		dispatch(registerCustomer({ email, password, name, lastname, phone }));
		window.location.replace(`/customer/login`);
	};

	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '5%', py: 3, px: 3, width: { xs: '60%', md: '30%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={1} direction={'column'} justifyContent={'center'}>
				<Typography color='#1976d2' align='center' variant='h6' align-items='center' gutterBottom component='div'>
					Customer Register
				</Typography>
				<Stack spacing={1} direction={'row'} justifyContent={'center'}>
					<TextField
						sx={{ width: '100%' }}
						label='Name'
						value={name}
						onChange={e => {
							setName(e.target.value);
						}}
					/>
					<TextField
						sx={{ width: '100%' }}
						width='100%'
						label='Lastname'
						value={lastname}
						onChange={e => {
							setLastname(e.target.value);
						}}
					/>
				</Stack>
				<TextField
					label='E-mail'
					value={email}
					onChange={e => {
						setEmail(e.target.value);
					}}
				/>
				<FormControl fullWidth sx={{ m: 1 }}>
					<OutlinedInput
						value={phone}
						onChange={e => {
							setPhone(e.target.value);
						}}
						startAdornment={<InputAdornment position='start'>+49</InputAdornment>}
					/>
				</FormControl>
				<TextField
					label='Password'
					type={'password'}
					value={password}
					onChange={e => {
						setPassword(e.target.value);
					}}
				/>
				<TextField
					label='Confirm Password'
					type={'password'}
					value={confirmPassword}
					onChange={e => {
						setConfirmPassword(e.target.value);
					}}
				/>
				<Button variant='contained' endIcon={<LoginIcon />} onClick={handleClickOpen}>
					Register
				</Button>

				{/* <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
					<DialogContent>
						<DialogContentText id='alert-dialog-description'>Verification E-mail sent.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={login} autoFocus>
							Back to Login
						</Button>
					</DialogActions>
				</Dialog> */}
				<Link component='button' variant='body2' onClick={alreadyRegistered}>
					Already Registered?
				</Link>
			</Stack>
		</Paper>
	);
};

export default RegisterCustomer;
