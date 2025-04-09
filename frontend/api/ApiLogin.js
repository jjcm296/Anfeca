import axios from 'axios';
import {API_BASE_URL} from '../config/Config';

export const ApiLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const ApiRefreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh`, { refreshToken });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

