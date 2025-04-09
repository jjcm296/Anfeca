import axios from 'axios';
import {API_BASE_URL} from '../config/Config';
import * as SecureStore from 'expo-secure-store';

export const ApiLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const ApiRefreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh`, {
            refreshToken,
        });

        const { accessToken } = response.data;

        await SecureStore.setItemAsync('accessToken', accessToken);
        console.log('Nuevo accessToken guardado:', accessToken);

        return accessToken; // también puedes retornar el token si lo necesitas
    } catch (error) {
        console.log("Error al refrescar token:", error?.response?.data || error.message);
        Alert.alert("Error", error?.response?.data?.error || "No se pudo refrescar el token");
        return null;
    }
};

