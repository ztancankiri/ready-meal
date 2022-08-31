import React from 'react';
import { Stack, TextField, Paper, Button, CardMedia, Link, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../resources/logo.png';
const ForgotPasswordPage = () => {
	let navigate = useNavigate();
	const backToLogin = () => {
		let path = `/customer/login`;
		window.location.replace(path);
	};
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '10%', py: 3, px: 3, width: { xs: '40%', md: '20%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={1} direction='column' justifyContent='center'>
				<TextField label='E-mail'></TextField>
				<Button variant='contained' onClick={handleClickOpen}>
					Reset Password
				</Button>
				<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
					<DialogContent>
						<DialogContentText id='alert-dialog-description'>Password reset request sent to your E-mail.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} autoFocus>
							Close
						</Button>
					</DialogActions>
				</Dialog>
				<Link component='button' variant='body2' onClick={backToLogin}>
					Back to Login
				</Link>
			</Stack>
		</Paper>
	);
};

export default ForgotPasswordPage;
