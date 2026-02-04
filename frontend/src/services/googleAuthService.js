const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

console.log('Google Auth Environment Variables:', {
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: GOOGLE_REDIRECT_URI,
    isDefined: !!GOOGLE_CLIENT_ID
});

class GoogleAuthService {
    getGoogleAuthUrl(state, mode = 'login') {
        if (!GOOGLE_CLIENT_ID) {
            console.error('GOOGLE_CLIENT_ID is not configured!');
            throw new Error('Google OAuth is not properly configured. Please check environment variables.');
        }

        console.log('Building Google Auth URL with:', {
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            state: state,
            mode: mode
        });

        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            scope: 'openid email profile',
            response_type: 'code',
            access_type: 'offline',
            prompt: mode === 'register' ? 'consent' : 'select_account',
            state: state,
            include_granted_scopes: 'true'
        });

        const fullUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        console.log('Generated Google Auth URL:', fullUrl);
        return fullUrl;
    }

    async handleAuthCallback(code, mode = 'login') {
        try {
            // Choose endpoint based on mode
            const endpoint = mode === 'register' ?
                '/api/auth/google/register' :
                '/api/auth/google/login';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    redirect_uri: GOOGLE_REDIRECT_URI
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle specific error codes
                if (result.error_code === 'USER_EXISTS' && mode === 'register') {
                    throw new Error('Email already registered. Please login instead.');
                } else if (result.error_code === 'USER_NOT_FOUND' && mode === 'login') {
                    throw new Error('No account found with this email. Please register first.');
                }
                throw new Error(result.error || 'Authentication failed');
            }

            return result;
        } catch (error) {
            console.error('Google auth callback error:', error);
            throw error;
        }
    }

    // Legacy methods for backward compatibility
    async signInWithPopup(isRegistration = false) {
        // This method now just redirects to the authorization URL
        const state = Math.random().toString(36).substring(2, 15);
        const mode = isRegistration ? 'register' : 'login';

        sessionStorage.setItem('google_oauth_state', state);
        sessionStorage.setItem('google_oauth_mode', mode);

        window.location.href = this.getGoogleAuthUrl(state, mode);
    }

    async signOut() {
        // Clear stored tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('google_oauth_state');
        sessionStorage.removeItem('google_oauth_mode');
    }
}

export default new GoogleAuthService();
