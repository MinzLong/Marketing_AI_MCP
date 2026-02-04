class OAuthStateManager {
    constructor() {
        this.prefix = 'google_oauth_';
    }

    generateState() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    storeState(state, mode = 'login') {
        console.log('Storing OAuth state:', { state, mode });
        sessionStorage.setItem(this.prefix + 'state', state);
        sessionStorage.setItem(this.prefix + 'mode', mode);
        sessionStorage.setItem(this.prefix + 'timestamp', Date.now().toString());
        return state;
    }

    validateState(receivedState) {
        const storedState = sessionStorage.getItem(this.prefix + 'state');
        const mode = sessionStorage.getItem(this.prefix + 'mode') || 'login';
        const timestamp = sessionStorage.getItem(this.prefix + 'timestamp');

        console.log('Validating OAuth state:', {
            received: receivedState,
            stored: storedState,
            mode: mode,
            timestamp: timestamp,
            age: timestamp ? Date.now() - parseInt(timestamp) : 'unknown'
        });

        // Check if state exists and matches
        if (!storedState) {
            throw new Error('No stored OAuth state found');
        }

        if (storedState !== receivedState) {
            // Try with URL decoding
            const decodedReceived = receivedState ? decodeURIComponent(receivedState) : null;
            if (storedState !== decodedReceived) {
                throw new Error(`OAuth state mismatch. Expected: ${storedState}, Got: ${receivedState}`);
            }
        }

        // Check if state is too old (5 minutes max)
        if (timestamp && (Date.now() - parseInt(timestamp) > 5 * 60 * 1000)) {
            throw new Error('OAuth state expired');
        }

        return { mode, storedState };
    }

    clearState() {
        sessionStorage.removeItem(this.prefix + 'state');
        sessionStorage.removeItem(this.prefix + 'mode');
        sessionStorage.removeItem(this.prefix + 'timestamp');
    }
}

export default new OAuthStateManager();
