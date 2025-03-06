import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedin, setLoggedin] = useState(false);

    return (
        <UserContext.Provider value={{ user, setUser, loggedin, setLoggedin }}>
            {children}
        </UserContext.Provider>
    );
};