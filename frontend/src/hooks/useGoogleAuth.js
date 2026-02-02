import { useState } from 'react';
import googleAuthService from '../services/googleAuthService';

const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await googleAuthService.signInWithPopup();

            // Store JWT token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            return result;
        } catch (err) {
            setError(err.message || 'Google authentication failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogleRedirect = () => {
        const authUrl = googleAuthService.getGoogleAuthUrl();
        window.location.href = authUrl;
    };

    const handleGoogleCallback = async (code) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await googleAuthService.handleAuthCallback(code);

            // Store JWT token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            return result;
        } catch (err) {
            setError(err.message || 'Google authentication callback failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signOutFromGoogle = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await googleAuthService.signOut();

            // Clear stored tokens
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            setError(err.message || 'Google sign-out failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signInWithGoogle,
        signInWithGoogleRedirect,
        handleGoogleCallback,
        signOutFromGoogle,
        isLoading,
        error
    };
};

export default useGoogleAuth;
