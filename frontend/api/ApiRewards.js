import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import * as SecureStore from "expo-secure-store";

export const getAllRewards = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/rewards/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Respuesta completa:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error en getAllRewards:", error.message);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const createReward = async (reward) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        console.log("Token a enviar:", token);
        const response = await axios.post(
            `${API_BASE_URL}/api/rewards/`,
            reward,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en createReward:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const deleteReward = async (rewardId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.delete(`${API_BASE_URL}/api/rewards/${rewardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en deleteReward:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const getRewardById = async (rewardId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/rewards/${rewardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch (error) {
        console.error("Error en getRewardById:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}