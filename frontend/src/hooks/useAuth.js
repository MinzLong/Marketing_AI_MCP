import { useState } from "react";
import { loginAction } from "../server/api/auth/login-action";

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginAction(username, password);

            if (result.success) {
                setIsAuthenticated(true);
                setError(null);
                return { success: true, user: result.user };
            } else {
                setError(result.message || 'Login failed');
                setIsAuthenticated(false);
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Login error in useAuth:', error);
            const errorMessage = error.message || 'Login failed. Please try again.';
            setError(errorMessage);
            setIsAuthenticated(false);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        isAuthenticated,
        login,
    };
};

export default useAuth;
