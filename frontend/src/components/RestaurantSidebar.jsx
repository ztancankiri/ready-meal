import MenuIcon from '@mui/icons-material/Menu';
import Settings from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SidebarItem from './SidebarItem';
import AvatarItem from './AvatarItem';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ContactSupport, MenuBook, FormatListBulleted } from '@mui/icons-material';
import logo from '../resources/logo.png';
import { Box, Stack, Drawer, List, Button, IconButton, CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantSelector, logout } from '../redux/restaurant/RestaurantReducer';
import { getRestaurant } from '../redux/restaurant/RestaurantActions';

import AccountImage from '../resources/account.png';

const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize;

const Sidebar = () => {
	const theme = useTheme();
	const restaurant = useSelector(restaurantSelector).single;
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();

	let navigate = useNavigate();

	const toggleOpen = () => {
		setOpen(!open);
	};

	const logoutClicked = () => {
		dispatch(logout());
		window.location.replace(`/restaurant/login`);
	};

	useEffect(() => {
		dispatch(getRestaurant(restaurant._id));
	}, [dispatch, restaurant._id]);

	return (
		<Drawer
			variant='permanent'
			open={open}
			sx={{
				width: open ? drawerWidthClose : { xs: drawerWidthClose, sm: drawerWidthOpen },
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: open ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen
				}),
				'& .MuiDrawer-paper': {
					justifyContent: 'space-between',
					overflowX: 'hidden',
					width: open ? drawerWidthClose : { xs: drawerWidthClose, sm: drawerWidthOpen },
					boxShadow: theme.shadows[8],
					backgroundColor: open ? '#11101D' : '#11101D',
					transition: theme.transitions.create('width', {
						easing: theme.transitions.easing.sharp,
						duration: open ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen
					})
				},
				scrollBar: {
					'&::-webkit-scrollbar': {
						width: '0.4em'
					},
					'&::-webkit-scrollbar-track': {
						'-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'rgba(0,0,0,.1)',
						outline: '1px solid slategrey'
					}
				}
			}}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					height: '42px',
					width: 'auto',
					backgroundColor: 'transparent',
					margin: '14px 14px',
					padding: '12px 0px',
					borderBottom: { xs: '', sm: '1px solid lightgray' },
					alignItems: 'flex-end'
				}}>
				<Box
					sx={{
						flexShrink: 0,
						display: open ? 'none' : { xs: 'none', sm: 'initial' },
						marginLeft: '30px'
					}}>
					<CardMedia component='img' image={logo} sx={{ maxWidth: 120 }} />
				</Box>

				<Button
					onClick={toggleOpen}
					sx={{
						display: { xs: 'none', sm: 'flex' },
						minWidth: 'initial',
						padding: '10px',
						color: 'gray',
						borderRadius: '8px',
						backgroundColor: open ? 'transparent' : 'transparent',
						'&:hover': {
							backgroundColor: '#26284687'
						}
					}}>
					<MenuIcon
						sx={{
							fontSize: '20px',
							color: open ? 'lightgray' : 'lightGray'
						}}
					/>
				</Button>
			</Box>

			<List dense={true}>
				<SidebarItem desc='Reservations' icon={MenuBook} dest='/restaurant/reservations' />
				<SidebarItem desc='Edit Menu' icon={FormatListBulleted} dest='/restaurant/edit-menu' />
				<SidebarItem desc='Support' icon={ContactSupport} dest='/restaurant/support' />
			</List>
			<Stack>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						alignContents: 'center',
						pt: '10px',
						pb: '5px',
						px: '4px',
						mx: '14px',
						my: 0,
						borderTop: '1px solid lightgray'
					}}>
					<AvatarItem name={restaurant.restaurant_name ? restaurant.restaurant_name : restaurant.email} photo={AccountImage} />
				</Box>
				<Stack sx={{ flexDirection: { xs: 'column', sm: open ? 'column' : 'row' }, mb: 2 }} justifyContent='center' alignItems='center'>
					<IconButton variant='contained' onClick={() => window.location.replace(`/restaurant/settings`)} sx={{ color: 'lightGray' }}>
						<Settings />
					</IconButton>

					<IconButton variant='contained' onClick={logoutClicked} sx={{ color: 'lightGray' }}>
						<LogoutIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Drawer>
	);
};

export default Sidebar;
