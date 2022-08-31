import HttpService from './HttpService';

export default class CustomerService {
	static baseURL() {
		return 'http://localhost:7777/api/v1/customer';
	}

	static register(email, password, name, lastname, phone) {
		//email, password, name, lastname, phone
		return HttpService.post(`${CustomerService.baseURL()}`, {
			email: email,
			password: password,
			first_name: name,
			last_name: lastname,
			phone_number: phone
		});
	}

	static login(email, password) {
		return HttpService.post(`${CustomerService.baseURL()}/login`, {
			email: email,
			password: password
		});
	}

	static update(customer_id, updatedCustomer) {
		return HttpService.put(`${CustomerService.baseURL()}/${customer_id}`, updatedCustomer);
	}

	static get(customer_id) {
		return HttpService.get(`${CustomerService.baseURL()}/${customer_id}`);
	}

	static getReservation(customer_id, reservation_id) {
		if (reservation_id) {
			return HttpService.get(`${CustomerService.baseURL()}/${customer_id}/reservation/${reservation_id}`);
		} else {
			return HttpService.get(`${CustomerService.baseURL()}/${customer_id}/reservation`);
		}
	}

	static createReservation(customer_id, reservation) {
		return HttpService.post(`${CustomerService.baseURL()}/${customer_id}/reservation`, reservation);
	}

	static updateReservation(customer_id, reservation_id, reservation_status) {
		return HttpService.put(`${CustomerService.baseURL()}/${customer_id}/reservation/${reservation_id}`, { reservation_status });
	}

	static payReservation(customer_id, reservation_id) {
		return HttpService.post(`${CustomerService.baseURL()}/${customer_id}/reservation/${reservation_id}/pay`, {});
	}

	static getReviewsByCustomerId(customer_id) {
		return HttpService.get(`${CustomerService.baseURL()}/${customer_id}/review`);
	}

	static createReview(customer_id, review) {
		return HttpService.post(`${CustomerService.baseURL()}/${customer_id}/review/`, review);
	}
}
