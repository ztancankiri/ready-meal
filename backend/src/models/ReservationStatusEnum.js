'use strict';
//export this
const ReservationStatus = {
	// CREATED -> PENDING: Payment required.
	CREATED: 0,
	PENDING: 1,
	APPROVED: 2,
	CANCELLED: 3,
	REJECTED: 4,
	COMPLETED: 5
};

module.exports = ReservationStatus;
