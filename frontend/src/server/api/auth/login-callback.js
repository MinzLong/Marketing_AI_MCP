import request from "../request";

export const loginCallback = async (user, password) => {
    return request.post("login", {
        username: user,
        password: password
    });
}

