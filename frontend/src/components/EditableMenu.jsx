import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditableRestaurantMenuView from './RestaurantViews/EditableRestaurantMenuView';
import { Stack, Box, Divider, CardMedia, Card, Dialog, DialogContent, Button, TextField, Typography, DialogActions } from '@mui/material';
import { createFood, getFoodsByRestaurant } from '../redux/restaurant/RestaurantFoodActions';
import { restaurantSelector } from '../redux/restaurant/RestaurantReducer';
import uploadPhoto from '../resources/upload-photo.js';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { AddCircle, FileUpload, Delete } from '@mui/icons-material';

const Input = styled('input')({
	display: 'none'
});

const theme = responsiveFontSizes(createTheme());

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%',
	display: 'block'
}));

const maxH = 150;
const maxW = 200;
const ratio = 0.75;

const minH = maxH * ratio;
const minW = maxW * ratio;

const EditableMenu = () => {
	const dispatch = useDispatch();

	const restaurant = useSelector(restaurantSelector);
	const allFoods = restaurant.food.all;

	const [food, setFood] = useState({
		name: '',
		price: '',
		ingredients: []
	});

	const [openAdd, setOpenAdd] = React.useState(false);
	const [isDisabled, setIsDisabled] = React.useState(true);
	const [postImage, setPostImage] = React.useState(undefined);

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

	const handleFileUpload = async e => {
		setIsDisabled(false);
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setPostImage(base64);
	};

	const handleClickOpenAdd = () => {
		setOpenAdd(true);
	};

	const handleFoodAdd = () => {
		let photo = {};
		if (postImage) {
			photo.content = postImage;
			photo.width = 300;
			photo.height = 150;
		} else {
			photo = undefined;
		}
		dispatch(createFood({ food, photo }));
		setFood({
			name: '',
			price: '',
			ingredients: []
		});
		setPostImage(undefined);
		setOpenAdd(false);
	};

	const handleCloseAdd = () => {
		setOpenAdd(false);
	};

	const handlePhotoRemove = () => {
		setIsDisabled(true);
		setPostImage(undefined);
	};

	useEffect(() => {
		dispatch(getFoodsByRestaurant(restaurant.single._id));
	}, [restaurant.single._id, dispatch]);

	return (
		<ThemeProvider theme={theme}>
			<Item
				sx={{
					textAlign: {
						xs: 'center',
						sm: 'center',
						md: 'left',
						lg: 'left',
						xl: 'left'
					},
					ml: 2,
					mt: 2,
					mr: 5
				}}>
				<Stack direction='column' spacing={2}>
					<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
						<h1>{restaurant.single.restaurant_name}</h1>
						<Button variant='contained' startIcon={<AddCircle />} onClick={handleClickOpenAdd}>
							Add Meal
						</Button>

						<Dialog open={openAdd} onClose={handleCloseAdd} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogContent>
								<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
									<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
										Add Meal
									</Typography>
									Please seperate ingredients with comma(",").<br></br>Write price as cents(€10.50 = 1050).
									<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
										<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={4}>
											<TextField
												label='Name'
												value={food.name}
												onChange={e => {
													setFood({ ...food, name: e.target.value });
												}}
												focused
											/>
											<TextField
												label='Ingredients'
												value={food.ingredients}
												onChange={e => {
													setFood({ ...food, ingredients: e.target.value.split(',') });
												}}
												focused
											/>
											<TextField
												label='Price'
												value={food.price}
												onChange={e => {
													setFood({ ...food, price: e.target.value });
												}}
												focused
											/>
										</Stack>
										<Divider orientation='vertical' flexItem sx={{ borderRightWidth: 2 }} />
										<Stack direction='column' justifyContent='space-between' alignItems='center' spacing={2}>
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

											<label htmlFor='contained-button-file'>
												<Input accept='image/*' id='contained-button-file' multiple type='file' onChange={e => handleFileUpload(e)} />
												<Button component='span' size='small' endIcon={<FileUpload />}>
													Upload
												</Button>
											</label>
											{isDisabled ? (
												<Button disabled component='span' size='small' endIcon={<Delete />}>
													Remove
												</Button>
											) : (
												<Button component='span' size='small' onClick={handlePhotoRemove} endIcon={<Delete />}>
													Remove
												</Button>
											)}
										</Stack>
									</Stack>
									<DialogActions sx={{ width: '100%' }}>
										<Button variant='contained' autoFocus onClick={handleFoodAdd}>
											Add
										</Button>
										<Button onClick={handleCloseAdd} variant='outlined' autoFocus>
											Close
										</Button>
									</DialogActions>
								</Stack>
							</DialogContent>
						</Dialog>
					</Stack>
					{Array.isArray(allFoods) ? (
						allFoods.map(meal => {
							return <EditableRestaurantMenuView food={meal} />;
						})
					) : (
						<></>
					)}
				</Stack>
			</Item>
		</ThemeProvider>
	);
};

export default EditableMenu;
