import { useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import { Stack, TextField, Paper, Button, CardMedia, Link, FormControl, OutlinedInput, InputAdornment, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../resources/logo.png';
import uploadPhoto from '../../resources/upload-photo.js';
import { styled } from '@mui/material/styles';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import cityMap from '../../resources/de-cities-map.json';
import cityList from '../../resources/de-cities-list.json';
import { registerRestaurant } from '../../redux/restaurant/RestaurantActions';

const filter = createFilterOptions();

const RegisterRestaurant = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [postImage, setPostImage] = useState(uploadPhoto);
	const [photoCheck, setphotoCheck] = useState(false);

	const alreadyRegistered = () => {
		window.location.replace(`/restaurant/login`);
	};

	const convertToBase64 = file => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = error => {
				reject(error);
			};
		});
	};

	const [restaurant, setRestaurant] = useState({
		email: '',
		password: '',
		phone_number: '',
		address_street: '',
		address_number: '',
		address_code: '',
		address_city: null,
		photo: uploadPhoto,
		restaurant_name: '',
		number_of_tables: 0
	});

	const [error, setError] = useState('');

	const handleClickOpen = () => {
		let photo = {};
		if (photoCheck) {
			photo.content = postImage;
			photo.width = 300;
			photo.height = 150;
		} else {
			photo = undefined;
		}
		dispatch(registerRestaurant({ restaurant, photo }));
		window.location.replace(`/restaurant/login`);
	};

	const handleFileUpload = async e => {
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setPostImage(base64);
		setphotoCheck(true);
	};

	const handleZipCode = async zipCode => {
		if (zipCode in cityMap) {
			setRestaurant({ ...restaurant, address_city: cityMap[zipCode], address_code: zipCode });
		}
	};

	const Input = styled('input')({
		display: 'none'
	});

	const maxH = 200;
	const maxW = 200;
	const ratio = 1;

	const minH = maxH * ratio;
	const minW = maxW * ratio;

	return (
		<Paper elevation={8} sx={{ mx: 'auto', mt: '2%', py: 3, px: 3, width: { xs: '60%', md: '30%' } }}>
			<CardMedia component='img' image={logo} sx={{ mx: 'auto', maxWidth: '70%', mb: 2 }} />
			<Stack spacing={1} direction={'column'} justifyContent={'center'}>
				<Typography color='#1976d2' align='center' variant='h6' align-items='center' gutterBottom component='div'>
					Restaurant Register
				</Typography>
				<Stack spacing={1} direction={'row'} justifyContent={'center'}>
					<Stack sx={{ flex: 1 }} spacing={1} direction={'column'} justifyContent={'center'} align-items='center'>
						<TextField
							sx={{ width: '100%' }}
							label='Name'
							value={restaurant.restaurant_name}
							onChange={e => {
								setRestaurant({ ...restaurant, restaurant_name: e.target.value });
							}}
						/>
						<TextField
							sx={{ width: '100%' }}
							label='E-mail'
							value={restaurant.email}
							onChange={e => {
								setRestaurant({ ...restaurant, email: e.target.value });
							}}
						/>
					</Stack>
					<label htmlFor='contained-button-file'>
						<Input accept='image/*' id='contained-button-file' multiple type='file' onChange={e => handleFileUpload(e)} />
						<Card
							sx={{
								maxHeight: {
									xs: minH,
									sm: minH,
									md: maxH,
									lg: maxH,
									xl: maxH
								},
								maxWidth: {
									xs: minW,
									sm: minW,
									md: maxW,
									lg: maxW,
									xl: maxW
								}
							}}>
							<CardMedia component='img' image={postImage} />
						</Card>
					</label>
				</Stack>

				<Stack spacing={1} direction={'row'} justifyContent={'center'}>
					<TextField
						sx={{ width: '80%' }}
						label='Street'
						value={restaurant.address_street}
						onChange={e => {
							setRestaurant({ ...restaurant, address_street: e.target.value });
						}}
					/>
					<TextField
						sx={{ width: '20%' }}
						label='Number'
						value={restaurant.address_number}
						onChange={e => {
							setRestaurant({ ...restaurant, address_number: e.target.value });
						}}
					/>
				</Stack>
				<Stack spacing={1} direction={'row'} justifyContent={'center'}>
					<TextField
						sx={{ width: '20%' }}
						label='Zip Code'
						value={restaurant.address_code}
						onChange={e => {
							setRestaurant({ ...restaurant, address_code: e.target.value });
							handleZipCode(e.target.value);
						}}
					/>
					<Autocomplete
						freeSolo
						sx={{ width: '80%' }}
						value={restaurant.address_city}
						onChange={(event, newValue) => setRestaurant({ ...restaurant, address_city: newValue })}
						filterOptions={(options, params) => filter(options, params)}
						selectOnFocus
						clearOnBlur
						handleHomeEndKeys
						options={cityList}
						renderOption={(props, option) => <li {...props}>{option}</li>}
						renderInput={params => <TextField {...params} label='City' />}
					/>
				</Stack>

				<TextField
					label='Number of tables'
					value={restaurant.number_of_tables}
					onChange={e => {
						setRestaurant({ ...restaurant, number_of_tables: e.target.value });
					}}
				/>
				<FormControl fullWidth sx={{ m: 1 }}>
					<OutlinedInput
						value={restaurant.phone_number}
						onChange={e => {
							setRestaurant({ ...restaurant, phone_number: e.target.value });
						}}
						startAdornment={<InputAdornment position='start'>+49</InputAdornment>}
					/>
				</FormControl>
				<TextField
					label='Password'
					type={'password'}
					value={restaurant.password}
					onChange={e => {
						setRestaurant({ ...restaurant, password: e.target.value });
					}}
				/>
				<TextField
					label='Confirm Password'
					type={'password'}
					value={restaurant.confirmPassword}
					onChange={e => {
						if (restaurant.password !== e.target.value) {
							setError('Passwords are not the same!');
						} else {
							setError('');
						}
					}}
				/>
				<Typography color='red' variant='body2'>
					{error}
				</Typography>
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

export default RegisterRestaurant;
