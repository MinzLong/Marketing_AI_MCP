import { useState } from 'react';
import googleAuthService from '../services/googleAuthService';
import oauthStateManager from '../services/oauthStateManager';

const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const signInWithGoogle = async (isRegistration = false) => {
        // Use redirect flow instead of popup for better compatibility
        signInWithGoogleRedirect(isRegistration);
    };

    const registerWithGoogle = async () => {
        signInWithGoogleRedirect(true);
    }; const loginWithGoogle = async () => {
        signInWithGoogleRedirect(false);
    };

    const signInWithGoogleRedirect = (isRegistration = false) => {
        try {
            // Clear any previous OAuth data
            sessionStorage.removeItem('processed_oauth_code');
            sessionStorage.removeItem('google_oauth_state');
            sessionStorage.removeItem('google_oauth_mode');

            // Generate state for CSRF protection
            const state = oauthStateManager.generateState();
            const mode = isRegistration ? 'register' : 'login';

            // Store state and mode using the state manager
            oauthStateManager.storeState(state, mode);

            console.log('Generating OAuth state:', {
                state: state,
                mode: mode,
                isRegistration: isRegistration
            });

            const authUrl = googleAuthService.getGoogleAuthUrl(state, mode);
            console.log('Redirecting to Google OAuth URL:', authUrl);
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error initiating Google OAuth:', error);
            setError(error.message);
        }
    };

    const handleGoogleCallback = async (code, mode = 'login') => {
        setIsLoading(true);
        setError(null); try {
            const endpoint = mode === 'register'
                ? '/api/auth/google/register'
                : '/api/auth/google/login';

            console.log('🔄 Making OAuth callback request:', {
                endpoint,
                code: code ? `${code.substring(0, 20)}...` : 'missing',
                mode
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    redirect_uri: 'http://localhost:5173/auth/google/callback'
                })
            });

            console.log('📡 OAuth API Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
            });

            let result;
            try {
                result = await response.json();
                console.log('📄 OAuth API Result:', result);
            } catch (parseError) {
                console.error('❌ Failed to parse response as JSON:', parseError);
                const textResult = await response.text();
                console.log('📝 Raw response text:', textResult);
                throw new Error(`Server returned invalid JSON: ${textResult.substring(0, 200)}`);
            } if (!response.ok) {
                console.error('❌ OAuth API Error:', result);
                throw new Error(result.error || `HTTP ${response.status}: Authentication failed`);
            }

            // Store JWT token in localStorage
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

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
        registerWithGoogle,
        loginWithGoogle,
        signInWithGoogleRedirect,
        handleGoogleCallback,
        signOutFromGoogle,
        isLoading,
        error
    };
};

export default useGoogleAuth;
