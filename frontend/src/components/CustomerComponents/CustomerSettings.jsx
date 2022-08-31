import React, { useEffect } from 'react';
import { Paper, Stack, Box } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider, styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { customerSelector } from '../../redux/customer/CustomerReducer';

import CustomerEditInfoView from './CustomerEditInfoView';

import { useDispatch } from 'react-redux';
import { getCustomer } from '../../redux/customer/CustomerActions';

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

const CustomerSettings = () => {
	const dispatch = useDispatch();
	const customer = useSelector(customerSelector).single;

	useEffect(() => {
		dispatch(getCustomer());
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
				<h1>Customer Settings</h1>
				<Paper sx={{ p: 2, width: 320 }}>
					<Stack direction='column' spacing={2}>
						<CustomerEditInfoView label='First Name' type='first_name' value={customer.first_name} />
						<CustomerEditInfoView label='Last Name' type='last_name' value={customer.last_name} />
						<CustomerEditInfoView label='Phone Number' type='phone_number' value={customer.phone_number} />
						<CustomerEditInfoView label='Password' type='password' value={''} />
					</Stack>
				</Paper>
			</Item>
		</ThemeProvider>
	);
};

export default CustomerSettings;
