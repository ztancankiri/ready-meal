import HttpService from './HttpService';

export default class RestaurantService {
	static baseURL() {
		return 'http://localhost:7777/api/v1/restaurant';
	}

	static register(restaurant) {
		//email, password, name, lastname, phone
		return HttpService.post(`${RestaurantService.baseURL()}`, restaurant);
	}

	static login(email, password) {
		return HttpService.post(`${RestaurantService.baseURL()}/login`, {
			email: email,
			password: password
		});
	}

	static update(restaurant_id, updatedRestaurant) {
		return HttpService.put(`${RestaurantService.baseURL()}/${restaurant_id}`, updatedRestaurant);
	}

	static get(restaurant_id) {
		if (restaurant_id) {
			return HttpService.get(`${RestaurantService.baseURL()}/${restaurant_id}`);
		} else {
			return HttpService.get(`${RestaurantService.baseURL()}`);
		}
	}

	static createFood(restaurant_id, food) {
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/food`, food);
	}

	static updateFood(restaurant_id, food_id, food) {
		return HttpService.put(`${RestaurantService.baseURL()}/${restaurant_id}/food/${food_id}`, food);
	}

	static deleteFood(restaurant_id, food_id) {
		return HttpService.remove(`${RestaurantService.baseURL()}/${restaurant_id}/food/${food_id}`);
	}

	static getFoodsByRestaurant(restaurant_id) {
		return HttpService.get(`${RestaurantService.baseURL()}/${restaurant_id}/food`);
	}

	static getReservationsByRestaurant(restaurant_id) {
		return HttpService.get(`${RestaurantService.baseURL()}/${restaurant_id}/reservation`);
	}

	static updateReservation(restaurant_id, reservation_id, reservation) {
		return HttpService.put(`${RestaurantService.baseURL()}/${restaurant_id}/reservation/${reservation_id}`, reservation);
	}

	static captureReservation(restaurant_id, reservation_id) {
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/reservation/${reservation_id}/capture`, {});
	}

	static cancelReservation(restaurant_id, reservation_id) {
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/reservation/${reservation_id}/cancel`, {});
	}

	static refundReservation(restaurant_id, reservation_id) {
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/reservation/${reservation_id}/refund`, {});
	}

	static uploadFoodPhoto(restaurant_id, food_id, photo) {
		//email, password, name, lastname, phone
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/food/${food_id}/photo`, photo);
	}

	static uploadRestaurantPhoto(restaurant_id, photo) {
		//email, password, name, lastname, phone
		return HttpService.post(`${RestaurantService.baseURL()}/${restaurant_id}/photo`, photo);
	}
}
