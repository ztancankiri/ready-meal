import { Box } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import DiscountListView from './CustomerHomeViews/DiscountListView';
import ReviewListView from './CustomerHomeViews/ReviewListView';

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

const CustomerHome = () => {
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
				<h1>Welcome Erdem Ege Marasli</h1>
				<Box sx={{ textAlign: 'center' }}>
					<h2>We have some special offers for you!</h2>
				</Box>
				<DiscountListView />
				<Box sx={{ mt: 10 }}>
					<h2>Last Reservations</h2>
				</Box>
				<ReviewListView />
			</Item>
		</ThemeProvider>
	);
};

export default CustomerHome;
