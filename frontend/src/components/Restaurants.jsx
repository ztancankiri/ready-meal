import { useEffect, useState } from 'react';
import RestaurantMediumView from './RestaurantViews/RestaurantMediumView';
import { Box, TextField, Grid } from '@mui/material';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector } from '../redux/restaurant/RestaurantReducer';
import { getAllRestaurants } from '../redux/restaurant/RestaurantActions';
import cityList from '../resources/de-cities-list.json';

const theme = responsiveFontSizes(createTheme());
const filter = createFilterOptions();

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	variant: 'outlined',
	padding: 10,
	width: '100%',
	display: 'block'
}));

const Restaurants = () => {
	const dispatch = useDispatch();
	const restaurants = useSelector(restaurantSelector).all;

	const sortValues = ['A-Z', 'Z-A'];

	const [filterValue, setFilterValue] = useState('');
	const [sortValue, setSortValue] = useState(sortValues[0]);
	const [city, setCity] = useState('');

	const filterChanged = e => {
		setFilterValue(e.target.value.trim());
	};

	const sorterChanged = (event, newValue) => {
		if (newValue) {
			setSortValue(newValue);
		}
	};
	useEffect(() => {
		dispatch(getAllRestaurants());
	}, [dispatch]);

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
				<h1>Restaurants</h1>
				<Grid
					container
					direction={{
						xs: 'column',
						sm: 'column',
						md: 'row',
						lg: 'row',
						xl: 'row'
					}}
					sx={{ mt: 2 }}
					justifyContent={{
						xs: 'center',
						sm: 'center',
						md: 'left',
						lg: 'left',
						xl: 'left'
					}}
					alignItems='center'>
					<TextField id='filter-restaurant-dishes' value={filterValue} onChange={filterChanged} label='Search Restaurants' sx={{ width: 220, mr: 2, mb: 2 }} />
					<Autocomplete
						freeSolo
						sx={{ width: '20%', mr: 2, mb: 2 }}
						value={city}
						onChange={(event, newValue) => setCity(newValue)}
						filterOptions={(options, params) => filter(options, params)}
						selectOnFocus
						clearOnBlur
						handleHomeEndKeys
						options={cityList}
						renderOption={(props, option) => <li {...props}>{option}</li>}
						renderInput={params => <TextField {...params} label='City' />}
					/>
					<Autocomplete
						disablePortal
						id='combo-box-dietary'
						options={[{ label: 'Gluten Free' }, { label: 'Kosher' }, { label: 'Vegan' }, { label: 'Vegatarian' }]}
						sx={{ width: 220, mr: 2, mb: 2 }}
						renderInput={params => <TextField {...params} label='Dietary Restrictions' />}
					/>
					<Autocomplete
						disablePortal
						id='combo-box-sort'
						onChange={sorterChanged}
						options={sortValues}
						sx={{ width: 220, mr: 2, mb: 2 }}
						renderInput={params => <TextField {...params} label='Sort' />}
					/>
				</Grid>
				{[...restaurants]
					.sort((x, y) => {
						const sortModifier = sortValue === sortValues[0] ? 1 : -1;

						if (x.restaurant_name > y.restaurant_name) {
							return 1 * sortModifier;
						} else if (x.restaurant_name < y.restaurant_name) {
							return -1 * sortModifier;
						} else {
							return 0;
						}
					})
					.map(restaurant => {
						if (!city || restaurant.address_city.toLowerCase() === city.toLowerCase()) {
							if (filterValue === '' || restaurant.restaurant_name.toLowerCase().includes(filterValue.toLowerCase())) {
								//restaurant.tagList.find(tag => tag.toLowerCase().includes(filterValue.toLowerCase()))
								return <RestaurantMediumView key={restaurant._id} restaurant={restaurant} />;
							} else {
								return <></>;
							}
						}
						return <></>;
					})}
			</Item>
		</ThemeProvider>
	);
};

export default Restaurants;
