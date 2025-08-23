import React, { createContext, useEffect, useState } from "react";
import { getUser } from "@/services/authApi"

//AuthContext created
export const AuthContext = createContext();

//auth provider created
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await getUser();
            if (!res.data.user) throw new Error('User not Autherised, Please login');
            setUser(res.data.user);
        } catch (error) {
            console.warn('User not logged in:', error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    //fetch user on mounting (or refreshing)
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}