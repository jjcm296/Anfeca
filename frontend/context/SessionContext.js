import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState({
        accessToken: null,
        accountId: null,
        guardianId: null,
        kidId: null,
        profileType: null,
    });

    useEffect(() => {
        const loadSession = async () => {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                updateSessionFromToken(token); // sin decoded, se decodifica aquí
            }
        };
        loadSession();
    }, []);

    const updateSessionFromToken = (token, decoded = null) => {
        try {
            const payload = decoded;

            setSession({
                accessToken: token,
                accountId: payload.id,
                guardianId: payload.guardianId,
                kidId: payload.kidId || null,
                profileType: payload.profileType,
            });
        } catch (error) {
            console.log("❌ Error al decodificar el token:", error.message);
        }
    };

    const clearSession = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setSession({
            accessToken: null,
            accountId: null,
            guardianId: null,
            kidId: null,
            profileType: null,
        });
    };

    return (
        <SessionContext.Provider value={{ session, setSession, updateSessionFromToken, clearSession }}>
            {children}
        </SessionContext.Provider>
    );
};
