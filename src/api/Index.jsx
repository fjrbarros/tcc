import axios from 'axios';

const Api = axios.create({
    // baseURL: 'http://54.233.238.26:8080/projectmanager/api/v1'
    baseURL: 'http://pjmanager.com.br:8080/projectmanager/api/v1'
});

Api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer OTA2ZmFlM2Y3MWZiZmM1ZmRhMWEzYThmODdiNzU4ODE=`;
    return config;
});

export default Api;