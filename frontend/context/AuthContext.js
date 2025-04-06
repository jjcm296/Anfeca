import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    // CArgar token al iniciar la app
    useEffect(() => {
       const loadToken = async () => {
           const token = await SecureStore.getItemAsync('accessToken');
           if (token) {
               setAccessToken(token);
           }
       };
       loadToken();
    },[]);

    // Iniciar sesión y guardar tokens
    const login = async ({ accessToken, refreshToken}) => {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        setAccessToken(accessToken);
    };

    // Cerrar sesión y eliminar tokens
    const logout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setAccessToken(null);
    };

    // Renovar el token
    const refreshccessToken = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
            logout();
            return null;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            const { accessToken } = response.data;
            await SecureStore.setItemAsync('accessToken', accessToken);
            setAccessToken(accessToken);
            return accessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, refreshccessToken }}>
            {children}
        </AuthContext.Provider>
    );

}