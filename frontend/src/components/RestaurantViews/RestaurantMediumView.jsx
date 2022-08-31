import { useNavigate } from 'react-router-dom';
import { Paper, Rating, Stack, IconButton, Divider, CardMedia, Typography, Box } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

const theme = responsiveFontSizes(createTheme());

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'left',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%'
}));

const maxH = 150;
const maxW = 200;
const ratio = 0.75;

const minH = maxH * ratio;
const minW = maxW * ratio;

const RestaurantMediumView = props => {
	const restaurant = props.restaurant;
	const navigate = useNavigate();

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
							image={`/api/v1/restaurant/${restaurant._id}/photo`}
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
						<Stack direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={1}>
							<Typography variant='h6'>{restaurant.restaurant_name}</Typography>
							<Typography variant='body2'>
								{restaurant.address_street} {restaurant.address_number}, {restaurant.address_code}, {restaurant.address_city}
							</Typography>
							{/* {props.tagList.length > 0 ? (
								<Stack direction='row' spacing={1}>
									<Typography variant='body2'>#</Typography>
									{props.tagList.map(tag => {
										return (
											<Typography variant='body2' key={tag}>
												{tag}
											</Typography>
										);
									})}
								</Stack>
							) : (
								<></>
							)} */}

							<Rating name='half-rating-read' defaultValue={parseFloat(restaurant.rating)} precision={0.5} readOnly />
						</Stack>
					</Stack>

					<Box component='span' m={1} display='flex' justifyContent='space-between' alignItems='center'>
						<IconButton color='primary' aria-label='add an alarm' onClick={() => window.location.replace(`/restaurant/${restaurant._id}/menu`)} sx={{ height: 'auto' }}>
							<ArrowForward />
						</IconButton>
					</Box>
				</Stack>
			</Item>
		</ThemeProvider>
	);
};

export default RestaurantMediumView;
