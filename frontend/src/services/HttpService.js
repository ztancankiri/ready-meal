import axios from 'axios';

export default class HttpService {
	static extractUser(token) {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace('-', '+').replace('_', '/');
		let parsedToken = JSON.parse(window.atob(base64));
		return parsedToken;
	}

	static async get(url) {
		const token = localStorage.getItem('jwtToken');
		const headers = {};

		if (token) {
			headers.Authorization = `JWT ${token}`;
		}

		try {
			const resp = await axios.get(url, { headers });

			if (this.checkIfUnauthorized(resp)) {
				window.location = '/restaurant/login';
				return;
			}

			if (resp.data.hasOwnProperty('token')) {
				localStorage.setItem('jwtToken', resp.data.token);
				resp.user = this.extractUser(resp.data.token);
			}
			return resp;
		} catch (err) {
			throw err;
		}
	}

	static async put(url, data) {
		const token = localStorage.getItem('jwtToken');
		const headers = {};

		if (token) {
			headers.Authorization = `JWT ${token}`;
		}

		try {
			const resp = await axios.put(url, data, { headers });

			if (this.checkIfUnauthorized(resp)) {
				window.location = '/restaurant/login';
				return;
			}

			if (resp.data.hasOwnProperty('token')) {
				localStorage.setItem('jwtToken', resp.data.token);
				resp.user = this.extractUser(resp.data.token);
			}
			return resp;
		} catch (err) {
			throw err;
		}
	}

	static async post(url, data) {
		const token = localStorage.getItem('jwtToken');
		const headers = {};

		if (token) {
			headers.Authorization = `JWT ${token}`;
		}

		try {
			const resp = await axios.post(url, data, { headers });

			if (this.checkIfUnauthorized(resp)) {
				window.location = '/restaurant/login';
				return;
			}

			if (resp.data.hasOwnProperty('token')) {
				localStorage.setItem('jwtToken', resp.data.token);
				resp.user = this.extractUser(resp.data.token);
			}
			return resp;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async remove(url) {
		const token = localStorage.getItem('jwtToken');
		const headers = {};

		if (token) {
			headers.Authorization = `JWT ${token}`;
		}

		try {
			const resp = await axios.delete(url, { headers });

			if (this.checkIfUnauthorized(resp)) {
				window.location = '/restaurant/login';
				return;
			}

			if (resp.data.hasOwnProperty('token')) {
				localStorage.setItem('jwtToken', resp.data.token);
				resp.user = this.extractUser(resp.data.token);
			}
			return resp;
		} catch (err) {
			throw err;
		}
	}

	static checkIfUnauthorized(res) {
		return res.status === 401;
	}
}
