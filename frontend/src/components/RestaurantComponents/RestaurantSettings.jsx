import React, { useEffect } from 'react';
import { Paper, Stack, Box, Divider, Card, CardMedia, Button } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { restaurantSelector } from '../../redux/restaurant/RestaurantReducer';
import { FileUpload } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import RestaurantEditInfoView from './RestaurantEditInfoView';
import { getRestaurant, uploadRestaurantPhoto } from '../../redux/restaurant/RestaurantActions';

const theme = responsiveFontSizes(createTheme());
const maxH = 150;
const maxW = 200;
const ratio = 0.75;
const Input = styled('input')({
	display: 'none'
});

const minH = maxH * ratio;
const minW = maxW * ratio;
const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%',
	display: 'block'
}));

const RestaurantSettings = () => {
	const dispatch = useDispatch();
	const restaurant = useSelector(restaurantSelector).single;
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
		const file = e.target.files[0];
		const base64 = await convertToBase64(file);
		setPostImage(base64);
		const photo = {};
		photo.content = base64;
		photo.width = 300;
		photo.height = 150;
		dispatch(uploadRestaurantPhoto(photo));
	};

	useEffect(() => {
		dispatch(getRestaurant());
	}, [dispatch]);
	useEffect(() => {
		if (restaurant._id) {
			setPostImage(`/api/v1/restaurant/${restaurant._id}/photo`);
		}
	}, [restaurant._id]);
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
				<h1>Restaurant Settings</h1>
				Please contact Support for other changes.
				<Paper sx={{ p: 2, width: 320 }}>
					<Stack direction='column' spacing={2}>
						<RestaurantEditInfoView label='Restaurant Name' type='restaurant_name' value={restaurant.restaurant_name} />
						<RestaurantEditInfoView label='Discount Ratio' type='discount_ratio' value={restaurant.discount_ratio} />
						<RestaurantEditInfoView label='Phone Number' type='phone_number' value={restaurant.phone_number} />
						<RestaurantEditInfoView label='Password' type='password' value={''} />
					</Stack>
					<br></br>
					<Divider orientation='vertical' flexItem sx={{ borderRightWidth: 2 }} />
					<Stack direction='column' justifyContent='space-between' spacing={2}>
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
					</Stack>
				</Paper>
			</Item>
		</ThemeProvider>
	);
};

export default RestaurantSettings;
