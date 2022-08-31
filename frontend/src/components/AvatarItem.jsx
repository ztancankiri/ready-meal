import { Box, Avatar, Typography } from '@mui/material';

const AvatarItem = props => {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					marginRight: '18px',
					paddingLeft: '0px',
					alignItems: 'center',
					alignContent: 'center'
				}}
			>
				<Box>
					<Avatar
						alt={props.name}
						sx={{ width: '32px', height: '32px' }}
						src={props.photo}
					/>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
				<Typography
					component='span'
					variant='body2'
					sx={{
						fontFamily: 'inherit',
						display: 'block',
						whiteSpace: 'nowrap',
						lineHeight: 'inherit',
						fontWeight: 500,
						color: 'lightgray'
					}}
				>
					{props.name}
				</Typography>
			</Box>
		</>
	);
};

export default AvatarItem;
