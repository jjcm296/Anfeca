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
        return null;
    }
};

export const ApiGetCurrentName = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await axios.get(`${API_BASE_URL}/api/account/profiles/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Extrae directamente el perfil y el tipo desde la respuesta
        const { profile, message } = response.data;

        if (!profile || !profile.name) throw new Error("Perfil inválido");

        const profileType = message.includes("guardian") ? "Tutor" : "Niño";

        return {
            id: profile._id || 'current',
            name: profile.name,
            type: profileType,
        };
    } catch (error) {
        console.log("Error al obtener el nombre del perfil:", error?.response?.data || error.message);
        return null;
    }
};

export const ApiGetProfilesNames = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await axios.get(`${API_BASE_URL}/api/account/profiles/names`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { profilesNames } = response.data;

        if (!profilesNames || typeof profilesNames !== 'object') throw new Error("Lista de perfiles inválida");

        const result = Object.entries(profilesNames).map(([key, value]) => ({
            id: key,
            name: value,
            type: key === "guardian" ? "Tutor" : "Niño",
        }));

        return result;
    } catch (error) {
        console.log("Error al obtener los nombres de los perfiles:", error?.response?.data || error.message);
        return null;
    }
};
