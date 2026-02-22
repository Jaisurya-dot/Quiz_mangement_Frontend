import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { access_token } = response.data;

            // Decode JWT to get user info (simple base64 decode)
            const payload = JSON.parse(atob(access_token.split('.')[1]));
            const userData = {
                id: payload.sub,
                role: payload.role,
                email: email,
            };

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed',
            };
        }
    };

    const register = async (username, email, password, role = 'STUDENT') => {
        try {
            await authAPI.register({ username, email, password, role });
            // Auto-login after registration
            return await login(email, password);
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const isStudent = () => {
        return user?.role === 'STUDENT';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStudent,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
