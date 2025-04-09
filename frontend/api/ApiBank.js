import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import * as SecureStore from "expo-secure-store";

export const getAllBanks = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/banks/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Respuesta completa:", response.data);

        return response.data;

    } catch (error) {
        console.error("Error en getAllBanks:", error.message);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const createBank = async (bank) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        console.log("Token a enviar:", token);
        const response = await axios.post(
            `${API_BASE_URL}/api/banks/`,
            bank,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error en createBank:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}