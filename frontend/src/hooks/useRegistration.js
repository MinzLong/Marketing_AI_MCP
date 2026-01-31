import { registrationAction } from "../server/api/registration/registration-action";

const useRegistration = () => {
    const register = async (user, email, password) => {
        const result = await registrationAction(user, email, password);
        return result;
    };

    return { register };
};

export default useRegistration;
