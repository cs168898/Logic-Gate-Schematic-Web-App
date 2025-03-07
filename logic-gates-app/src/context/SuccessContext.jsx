import React, { createContext, useState } from 'react';

export const SuccessContext = createContext();

export const SuccessProvider = ({ children }) => {
    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <SuccessContext.Provider value={{ isSuccess, setIsSuccess }}>
            {children}
        </SuccessContext.Provider>
    );
};