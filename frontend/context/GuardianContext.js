import React, { createContext, useState } from 'react';

export const GuardianContext = createContext();

export const GuardianProvider = ({ children }) => {
    const [guardian, setGuardian] = useState({
        name: '',
        lastName: '',
    });

    return (
        <GuardianContext.Provider value={{ guardian, setGuardian }}>
            {children}
        </GuardianContext.Provider>
    );
};