import axios from 'axios'

const reportingBridge = axios.create({
    baseURL: import.meta.env.VITE_REPORTING_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
    }
});

// assign token if exists

reportingBridge.interceptors.request.use(function (config) {
    let jwt = localStorage.getItem('dfreportauth');
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
})

export default reportingBridge;