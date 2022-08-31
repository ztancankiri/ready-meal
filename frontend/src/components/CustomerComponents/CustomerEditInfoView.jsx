import React, { useEffect, useState } from 'react';
import { Stack, TextField, IconButton } from '@mui/material';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { customerSelector } from '../../redux/customer/CustomerReducer';
import { updateCustomer } from '../../redux/customer/CustomerActions';
import { useSelector } from 'react-redux';

const CustomerEditInfoView = props => {
	const customer = useSelector(customerSelector).single;
	const dispatch = useDispatch();

	const { label, type, value } = props;

	const isPassword = type === 'password';

	const [newValue, setNewValue] = useState(value);
	const [isEditting, setIsEditting] = useState(false);
	const [passwordVisible, setPasswordVisible] = React.useState(false);

	const handleNewValue = () => {
		setIsEditting(true);
	};

	const saveNewValue = () => {
		const updatedCustomer = {};
		updatedCustomer[type] = newValue;
		const customer_id = customer._id;

		dispatch(updateCustomer({ customer_id, updatedCustomer }));
		setIsEditting(false);
	};

	const cancelNewValue = () => {
		setNewValue(value);
		setIsEditting(false);
	};

	const handlePasswordVisible = () => {
		setPasswordVisible(!passwordVisible);
	};

	useEffect(() => {
		setNewValue(value);
	}, [value]);

	return (
		<Stack direction='row'>
			<TextField
				label={label}
				value={newValue}
				onChange={e => {
					setNewValue(e.target.value);
				}}
				sx={{ width: 200 }}
				disabled={!isEditting}
				type={isPassword ? (passwordVisible ? 'text' : 'password') : 'text'}
			/>
			<Stack direction='row' alignItems='center'>
				{isEditting ? (
					<>
						{isPassword ? <IconButton onClick={handlePasswordVisible}>{passwordVisible ? <Visibility /> : <VisibilityOff />}</IconButton> : <></>}
						<IconButton color='primary' onClick={saveNewValue}>
							<CheckCircleIcon />
						</IconButton>
						<IconButton color='secondary' onClick={cancelNewValue}>
							<CancelIcon />
						</IconButton>
					</>
				) : (
					<IconButton color='primary' onClick={handleNewValue}>
						<DriveFileRenameOutlineRoundedIcon />
					</IconButton>
				)}
			</Stack>
		</Stack>
	);
};

export default CustomerEditInfoView;
