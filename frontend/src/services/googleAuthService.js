const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

class GoogleAuthService {
    constructor() {
        this.isInitialized = false;
    }

    async initializeGoogleAuth() {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                resolve();
                return;
            }

            // Load Google Identity Services script
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => {
                this.isInitialized = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async signInWithPopup() {
        try {
            if (!this.isInitialized) {
                await this.initializeGoogleAuth();
            }

            return new Promise((resolve, reject) => {
                // Use Google Identity Services OAuth2 popup
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'openid email profile',
                    callback: async (response) => {
                        try {
                            if (response.error) {
                                reject(response);
                                return;
                            }

                            // Get user info using the access token
                            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                                headers: {
                                    'Authorization': `Bearer ${response.access_token}`
                                }
                            });

                            if (!userInfoResponse.ok) {
                                throw new Error('Failed to get user info');
                            }

                            const userInfo = await userInfoResponse.json();

                            // Send to backend for verification with user info
                            const backendResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google/verify-user`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    access_token: response.access_token,
                                    user_info: userInfo
                                })
                            });

                            const result = await backendResponse.json();

                            if (!backendResponse.ok) {
                                throw new Error(result.error || 'Authentication failed');
                            }

                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }
                });

                // Request access token
                client.requestAccessToken();
            });
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    getGoogleAuthUrl() {
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            scope: 'openid email profile',
            response_type: 'code',
            access_type: 'offline'
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async handleAuthCallback(code) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            return data;
        } catch (error) {
            console.error('Google callback error:', error);
            throw error;
        }
    }
}

export default new GoogleAuthService();
