import request from "../request";

export const registrationCallback = async (user, email, password) => {
    return request.post("register", {
        username: user,      // Form sends username
        email: email,
        password: password
    });
}
