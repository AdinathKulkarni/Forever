import React, { createContext, useState } from 'react'

export const AuthContext = createContext();

const AuthContextProvider = ({children}) => {

    const [loginToken, setLoginToken] = useState(localStorage.getItem('user-login-token') ? localStorage.getItem('user-login-token') : '');

    const value = {
        loginToken, setLoginToken
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider