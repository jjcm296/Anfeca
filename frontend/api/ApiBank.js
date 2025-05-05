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
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const createBank = async (bank) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
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
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const deleteBank = async (bankId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.delete(`${API_BASE_URL}/api/banks/${bankId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const getBankById = async (bankId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/banks/${bankId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const updateBank = async (bankId, bank) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.put(`${API_BASE_URL}/api/banks/${bankId}`, bank, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};
