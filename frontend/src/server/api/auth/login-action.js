import { loginCallback } from "./login-callback";
import { fetchResponse } from "../fetch-response";

export const loginAction = async (user, password) => {
    try {
        const callBack = () => loginCallback(user, password);
        const response = await fetchResponse(callBack);

        if (response.status && response.data) {
            // Store tokens if login is successful
            if (response.data.token) {
                localStorage.setItem('jwtToken', response.data.token);
            }
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            return {
                success: true,
                data: response.data,
                user: response.data.user
            };
        } else {
            return {
                success: false,
                message: response.error || 'Login failed'
            };
        }
    } catch (error) {
        console.error('Login action error:', error);
        return {
            success: false,
            message: error.message || 'Login failed'
        };
    }
}



