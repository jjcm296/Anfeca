import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/Config';

export const ApiGetPremiumBanks = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/premium/banks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudieron obtener los bancos premium" };
    }
};

export const ApiGetPremiumBankById = async (bankId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/premium/banks/${bankId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo obtener el banco premium" };
    }
};

export const ApiGetPremiumBankQuestions = async (bankId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/premium/banks/${bankId}/questions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudieron obtener las preguntas del banco premium" };
    }
};

