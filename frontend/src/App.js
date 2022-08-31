import { Box } from '@mui/material';

import Restaurants from './components/Restaurants';
import RestaurantReservations from './components/RestaurantReservations';
import EditableMenu from './components/EditableMenu';
import Menu from './components/Menu';
import CustomerHome from './components/CustomerComponents/CustomerHome';
import RegisterCustomer from './components/CustomerComponents/RegisterCustomer';
import RegisterRestaurant from './components/RestaurantComponents/RegisterRestaurant';
import CustomerSidebar from './components/CustomerSidebar';
import RestaurantSidebar from './components/RestaurantSidebar';
import ForgotPassword from './components/ForgotPassword';
import CustomerSettings from './components/CustomerComponents/CustomerSettings';
import RestaurantSettings from './components/RestaurantComponents/RestaurantSettings';

import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginRestaurant from './components/RestaurantComponents/LoginRestaurant';
import LoginCustomer from './components/CustomerComponents/LoginCustomer';
import HttpService from './services/HttpService';

import Home from './components/Home';
import CustomerReservations from './components/CustomerComponents/CustomerReservations';

const App = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const user = HttpService.extractUser(token);

			if (user) {
				if (user.is_restaurant && ['/', '/customer/login', '/restaurant/login', '/customer/register', '/restaurant/register', '/forgot-password'].includes(window.location.pathname)) {
					window.location.replace('/restaurant/reservations');
				} else if (!user.is_restaurant && ['/', '/customer/login', '/restaurant/login', '/customer/register', '/restaurant/register', '/forgot-password'].includes(window.location.pathname)) {
					window.location.replace('/customer/home');
				}
			} else if (!['/customer/login', '/restaurant/login', '/customer/register', '/restaurant/register', '/forgot-password'].includes(window.location.pathname)) {
				window.location.replace('/');
			}
		} else if (!['/customer/login', '/restaurant/login', '/customer/register', '/restaurant/register', '/forgot-password', '/'].includes(window.location.pathname)) {
			window.location.replace('/');
		}
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<Routes>
				<Route
					path='/customer/home'
					element={
						<>
							<CustomerSidebar />
							<CustomerHome sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/customer/restaurants'
					element={
						<>
							<CustomerSidebar />
							<Restaurants sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/customer/reservations'
					element={
						<>
							<CustomerSidebar />
							<CustomerReservations />
						</>
					}
				/>
				<Route
					path='/customer/settings'
					element={
						<>
							<CustomerSidebar />
							<CustomerSettings sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/customer/support'
					element={
						<>
							<CustomerSidebar />
							<></>
						</>
					}
				/>
				<Route
					path='/restaurant/reservations'
					element={
						<>
							<RestaurantSidebar />
							<RestaurantReservations sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/restaurant/edit-menu'
					element={
						<>
							<RestaurantSidebar />
							<EditableMenu sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/restaurant/:restaurant_id/menu'
					element={
						<>
							<CustomerSidebar />
							<Menu sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/restaurant/settings'
					element={
						<>
							<RestaurantSidebar />
							<RestaurantSettings sx={{ overflowY: 'auto' }} />
						</>
					}
				/>
				<Route
					path='/restaurant/support'
					element={
						<>
							<RestaurantSidebar />
							<></>
						</>
					}
				/>

				<Route path='/' element={<Home />} />
				<Route path='/customer/login' element={<LoginCustomer />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/customer/register' element={<RegisterCustomer />} />
				<Route path='/restaurant/register' element={<RegisterRestaurant />} />
				<Route path='/restaurant/login' element={<LoginRestaurant />} />
			</Routes>
		</Box>
	);
};

export default App;
