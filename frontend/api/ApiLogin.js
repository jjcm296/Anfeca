import axios from 'axios';
import { API_BASE_URL } from '../config/Config';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export const ApiLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "Error desconocido al iniciar sesión." };
    }
};

export const ApiRefreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh`, { refreshToken });
        const { accessToken } = response.data;

        await SecureStore.setItemAsync('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        return null;
    }
};

export const ApiGetCurrentName = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await axios.get(`${API_BASE_URL}/api/account/profiles/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { profile, message } = response.data;
        if (!profile || !profile.name) throw new Error("Perfil inválido");

        const profileType = message.includes("guardian") ? "Tutor" : "Niño";

        return {
            id: profile._id || 'current',
            name: profile.name,
            type: profileType,
        };
    } catch (error) {
        return null;
    }
};

export const ApiGetProfilesNames = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await axios.get(`${API_BASE_URL}/api/account/profiles/names`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { profilesNames } = response.data;
        if (!profilesNames || typeof profilesNames !== 'object') throw new Error("Lista de perfiles inválida");

        return Object.entries(profilesNames).map(([key, value]) => ({
            id: key,
            name: value,
            type: key === "guardian" ? "Tutor" : "Niño",
        }));
    } catch (error) {
        return null;
    }
};

export const ApiSwitchProfile = async (targetProfile, password = null) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const body = password ? { targetProfile, password } : { targetProfile };

        const response = await axios.post(
            `${API_BASE_URL}/api/account/profiles/switch`,
            body,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const { newAccessToken, newRefreshToken } = response.data;

        if (newAccessToken && newRefreshToken) {
            await SecureStore.setItemAsync('accessToken', newAccessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);

            const decoded = jwtDecode(newAccessToken);

            return {
                ...response.data,
                decoded,
            };
        }

        return null;
    } catch (error) {
        return null;
    }
};