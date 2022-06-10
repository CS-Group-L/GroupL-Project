import React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const authContext = React.createContext()

const useAuth = () => {
    return useContext(authContext)
}

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        jwt: null,
        username: null
    })

    const checkAuth = useCallback(() => {
        if (!authState || authState.jwt === null || authState.username === null) {
            if (location.pathname === "/") return "login"
            navigate("/");
            return false;
        }
        return true;
    }, [authState])

    useEffect(() => {
        checkAuth()
    }, [authState])

    useEffect(() => {
        const authJSON = sessionStorage.getItem("auth");
        setAuthState(JSON.parse(authJSON)); 
    }, [])

    return <authContext.Provider value={[authState, checkAuth, setAuthState]}>
        {children}
    </authContext.Provider>
}

export default useAuth