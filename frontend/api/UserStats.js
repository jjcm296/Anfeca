import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {API_BASE_URL} from "../config/Config";

export const ApiGetCoins = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/kids/coins`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const ApiGetStreaks = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/kids/streak`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}