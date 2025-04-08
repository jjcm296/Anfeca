import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import {API_BASE_URL} from '../config/Config';

export const ApiAccount = async (body) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, body);
        return response.data;
    } catch (error) {
        console.error("Error en ApiAccount:", error);
        return error.response?.data || { error: "Error desconocido al crear la cuenta." };
    }
};

export const ApiSendCode = async (body) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/verification-code`, body);
        return response.data;
    } catch (error) {
        console.error("Error en ApiSendCode:", error);
        return error.response?.data || { error: "Error desconocido al enviar el código." };
    }
};

export const ApiVerifyCode = async (body) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/verification-code/verify`, body);
        return response.data;
    } catch (error) {
        console.error("Error en ApiVerifyCode:", error);
        return error.response?.data || { error: "Error desconocido al verificar el código." };
    }
};

export const ApiCreateKid = async (body) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');

        const response = await axios.post(
            `${API_BASE_URL}/api/kids/`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error en ApiCreateKid:", error);
        return error.response?.data || { error: "Error desconocido al crear el niño." };
    }
};
