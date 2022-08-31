import React, { useState } from 'react';
import { Paper, Stack, IconButton, Divider, CardMedia, Card, Box, Dialog, DialogContent, Button, TextField, Typography, DialogActions, DialogContentText } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Delete, FileUpload } from '@mui/icons-material';
import uploadPhoto from '../../resources/upload-photo.js';
import { restaurantSelector } from '../../redux/restaurant/RestaurantReducer';
import { updateFood, deleteFood, getFoodsByRestaurant, uploadFoodPhoto } from '../../redux/restaurant/RestaurantFoodActions';

const theme = responsiveFontSizes(createTheme());

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'left',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%'
}));

const Input = styled('input')({
	display: 'none'
});

const maxH = 150;
const maxW = 200;
const ratio = 0.75;

const minH = maxH * ratio;
const minW = maxW * ratio;

const EditableRestaurantMenuView = props => {
	const dispatch = useDispatch();
	const restaurant = useSelector(restaurantSelector);

	const [food, setFood] = useState({
		name: props.food.name,
		price: props.food.price,
		ingredients: props.food.ingredients,
		photo: props.food.photo
	});

	const [openEdit, setOpenEdit] = React.useState(false);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [postImage, setPostImage] = React.useState(props.food.imgSrc);

	const handleClickOpenEdit = () => {
		setOpenEdit(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	const [openDelete, setOpenDelete] = React.useState(false);

	const handleClickOpenDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
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

	const handlePhotoRemove = () => {
		setIsDisabled(true);
		setPostImage(uploadPhoto);
	};

	const handleFileUpload = async e => {
		setIsDisabled(false);
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setPostImage(base64);
	};

	const handleFoodUpdate = () => {
		const food_id = props.food._id;
		const photo = {};
		photo.content = postImage;
		photo.width = 300;
		photo.height = 150;
		dispatch(updateFood({ food_id, food }));
		dispatch(uploadFoodPhoto({ food_id, photo }));
		dispatch(getFoodsByRestaurant(restaurant.single._id));
		window.location.replace('/restaurant/edit-menu');
		setOpenEdit(false);
	};

	const handleFoodDelete = () => {
		dispatch(deleteFood(props.food._id));
		dispatch(getFoodsByRestaurant(restaurant.single._id));
		setOpenDelete(false);
	};

	return (
		<ThemeProvider theme={theme}>
			<Item sx={{ mb: 2 }}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={1}>
					<Stack
						direction={{
							xs: 'column',
							sm: 'column',
							md: 'row',
							lg: 'row',
							xl: 'row'
						}}
						justifyContent='flex-start'
						alignItems={{
							xs: 'center',
							sm: 'flex-start',
							md: 'flex-start',
							lg: 'flex-start',
							xl: 'flex-start'
						}}
						spacing={1}>
						<CardMedia
							component='img'
							image={`/api/v1/restaurant/${restaurant.single._id}/food/${props.food._id}/photo`}
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
							}}
						/>
						<Divider orientation='vertical' flexItem sx={{ borderRightWidth: 2 }} />
						<Stack direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
							<Typography variant='h6'>{props.food.name}</Typography>
							<Typography variant='body2'>{props.food.ingredients.join(',')}</Typography>
							<Typography variant='h6'>€{parseFloat(props.food.price / 100).toFixed(2)}</Typography>
						</Stack>
					</Stack>
					<Box component='span' m={1} display='flex' justifyContent='space-between' alignItems='center'>
						<IconButton onClick={handleClickOpenEdit} color='primary' aria-label='add an alarm' sx={{ height: 'auto' }}>
							<Edit />
						</IconButton>
						<IconButton onClick={handleClickOpenDelete} color='primary' aria-label='add an alarm' sx={{ height: 'auto' }}>
							<Delete />
						</IconButton>
						<Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogContent>
								<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={3}>
									<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
										Update Meal
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
										<Stack direction='column' justifyContent='space-between' alignItems='center' spacing={1}>
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
										<Button variant='contained' autoFocus onClick={handleFoodUpdate}>
											Update
										</Button>
										<Button onClick={handleCloseEdit} variant='outlined' autoFocus>
											Close
										</Button>
									</DialogActions>
								</Stack>
							</DialogContent>
						</Dialog>
						<Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogContent>
								<Stack direction='column' justifyContent='space-between' alignItems='flex-start' spacing={2}>
									<Typography id='modal-modal-title' color='#1976d2' variant='h6' component='h2'>
										Delete Meal
									</Typography>
									<DialogContentText id='alert-dialog-description'>Are you sure to delete this meal?</DialogContentText>
									<DialogActions sx={{ width: '100%' }}>
										<Button variant='contained' autoFocus onClick={handleFoodDelete}>
											Delete
										</Button>
										<Button onClick={handleCloseDelete} variant='outlined' autoFocus>
											Close
										</Button>
									</DialogActions>
								</Stack>
							</DialogContent>
						</Dialog>
					</Box>
				</Stack>
			</Item>
		</ThemeProvider>
	);
};

export default EditableRestaurantMenuView;
