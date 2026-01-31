import { fetchResponse } from "../fetch-response";
import { registrationCallback } from "./registration-callback";


export const registrationAction = async (user, email, password) => {
    try {
        const callBack = () => registrationCallback(user, email, password);
        const response = await fetchResponse(callBack);

        if (response.status && response.data) {
            return {
                success: true,
                data: response.data
            };
        } else {
            return {
                success: false,
                error: response.error || 'Registration failed'
            };
        }
    } catch (error) {
        console.error('Registration action error:', error);
        return {
            success: false,
            error: error.message || 'Registration failed'
        };
    }
}
