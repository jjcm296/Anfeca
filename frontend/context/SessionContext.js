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
                updateSessionFromToken(token);
            }
        };
        loadSession();
    }, []);

    const updateSessionFromToken = (token) => {
        const decoded = jwt_decode(token);
        setSession({
            accessToken: token,
            accountId: decoded.id,
            guardianId: decoded.guardianId,
            kidId: decoded.kidId || null,
            profileType: decoded.profileType,
        });
    };

    const clearSession = async () => {
        await SecureStore.deleteItemAsync('accessToken');
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
