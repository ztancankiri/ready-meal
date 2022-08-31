import {
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';

const SidebarItem = props => {
	return (
		<Tooltip
			title={props.desc}
			placement={'right'}
			componentsProps={{
				tooltip: {
					sx: {
						backgroundColor: 'gray',
						color: 'white',
						marginLeft: '22px !important',
						boxShadow: '0px 0px 22px -2px rgba(0,0,0,0.20)'
					}
				}
			}}
		>
			<ListItemButton
				sx={{
					margin: '6px 14px',
					padding: '10px',
					borderRadius: '8px',
					'&:hover': { backgroundColor: '#26284687' }
				}}
				component={Link}
				to={`${props.dest}`}
			>
				<ListItemIcon sx={{ minWidth: '46px' }}>
					<props.icon sx={{ fontSize: '20px', color: 'lightgray' }} />
				</ListItemIcon>

				<ListItemText
					primary={props.desc}
					primaryTypographyProps={{ variant: 'body2' }}
					sx={{
						display: 'inline',
						overflowX: 'hidden',
						color: 'lightgray',
						whiteSpace: 'nowrap',
						minWidth: '126px'
					}}
				/>
			</ListItemButton>
		</Tooltip>
	);
};

export default SidebarItem;
