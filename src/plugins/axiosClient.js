import axios from 'axios'

const apiClient = axios.create({
	baseURL: 'http://backend.test/api',
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
	}
})

export default apiClient;