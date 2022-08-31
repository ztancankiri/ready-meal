import { Card, Paper, Stack, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const maxH = 150;
const maxW = 200;
const ratio = 0.75;

const minH = maxH * ratio;
const minW = maxW * ratio;

const DiscountView = props => {
	const navigate = useNavigate();
	const restaurant = props.restaurant;

	return (
		<Paper
			sx={{
				p: 1
			}}>
			<Stack direction='column' spacing={1} justifyContent='center' alignItems='center'>
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
					}}
					onClick={() => window.location.replace(`/restaurant/${restaurant._id}/menu`)}>
					<CardMedia height='150' component='img' image={`/api/v1/restaurant/${restaurant._id}/photo`} />
				</Card>
				<Typography onClick={() => window.location.replace(`/restaurant/${restaurant._id}/menu`)}>
					{restaurant.discount_ratio}% Discount at {restaurant.restaurant_name}
				</Typography>
			</Stack>
		</Paper>
	);
};

export default DiscountView;
