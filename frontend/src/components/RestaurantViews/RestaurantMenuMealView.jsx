import { Paper, Stack, IconButton, Divider, CardMedia, Box, Typography } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { Add, Remove } from '@mui/icons-material';
import { useState } from 'react';

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

const RestaurantMenuMealView = props => {
	const { addOrder, removeOrder, meal } = props;

	const [count, setCount] = useState(0);

	const decreaseCount = () => {
		if (count > 0) {
			setCount(count - 1);
			removeOrder(meal);
		}
	};
	const increaseCount = () => {
		setCount(count + 1);
		addOrder(meal);
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
							image={`/api/v1/restaurant/${meal.restaurant_id}/food/${meal._id}/photo`}
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
							<Typography variant='h6'>{meal.name}</Typography>
							<Stack direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={1}>
								{meal.ingredients ? (
									meal.ingredients.map(ingredient => (
										<Typography variant='body2' key={ingredient}>
											#{ingredient}{' '}
										</Typography>
									))
								) : (
									<></>
								)}
							</Stack>
							<Typography variant='h6'>{meal.price}</Typography>
						</Stack>
					</Stack>
					<Box component='span' m={1} display='flex' justifyContent='space-between' alignItems='center'>
						<IconButton color='primary' aria-label='add an alarm' sx={{ height: 'auto' }} onClick={decreaseCount}>
							<Remove />
						</IconButton>
						{count}
						<IconButton color='primary' aria-label='add an alarm' sx={{ height: 'auto' }} onClick={increaseCount}>
							<Add />
						</IconButton>
					</Box>
				</Stack>
			</Item>
		</ThemeProvider>
	);
};

export default RestaurantMenuMealView;
