import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import * as SecureStore from "expo-secure-store";

export const getAllQuestions = async (backId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/banks/${backId}/questions/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Respuesta completa:", response.data);

        return response.data;

    } catch (error) {
        console.error("Error en getAllQuestions:", error.message);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const createQuestion = async (question,bankId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        console.log("Token a enviar:", token);
        const response = await axios.post(
            `${API_BASE_URL}/api/banks/${bankId}/questions/`,
            question,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error en createQuestion:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const deleteQuestion = async (bankId, questionId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.delete(`${API_BASE_URL}/api/banks/${bankId}/questions/${questionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error en deleteQuestion:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const getQuestionById = async (bankId, questionId) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        const response = await axios.get(`${API_BASE_URL}/api/banks/${bankId}/questions/${questionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error en getQuestionById:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}

export const ApiEditQuestion = async (bankId, questionId, question) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');

        const response = await axios.put(
            `${API_BASE_URL}/api/banks/${bankId}/questions/${questionId}`,
            question,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en ApiEditQuestion:", error);
        return error.response?.data || { error: "No se pudo conectar con el servidor" };
    }
}