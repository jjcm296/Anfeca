import React, { createContext, useState } from 'react';

export const CoinUpdateContext = createContext();

export const CoinUpdateProvider = ({ children }) => {
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const triggerRefresh = () => setShouldRefresh(prev => !prev);

    return (
        <CoinUpdateContext.Provider value={{ shouldRefresh, triggerRefresh }}>
            {children}
        </CoinUpdateContext.Provider>
    );
};
