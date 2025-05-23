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
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const createReward = async (reward) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
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
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

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
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const getRewardById = async (rewardId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/rewards/${rewardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const ApiEditReward = async (rewardId, reward) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.put(`${API_BASE_URL}/api/rewards/${rewardId}`, reward, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
};

export const getUnconfirmedRewards = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/rewards/redeemed-rewards`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudieron obtener las recompensas canjeadas" };
    }
};

export const confirmRedeemedReward = async (redeemedRewardId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.post(
            `${API_BASE_URL}/api/rewards/redeemed-rewards/${redeemedRewardId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo confirmar la recompensa" };
    }
};
export const redeemReward = async (rewardId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.post(
            `${API_BASE_URL}/api/rewards/${rewardId}/redeem`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { error: "No se pudo canjear la recompensa" };
    }
};