import request from "./request";

const fetchAPI = async (endpoint) => {
    try {

        const response = await request({
            url: endpoint,
            method: "GET",
        });
        return { data: response.data, status: response.status };
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            console.error("Request timed out");
        } else {
            console.error("API error:", error.message);
        }
        return {
            error: error.message,
            status: false
        }
    }
};

const fetchResponse = async (syncCallBackRequest) => {
    try {
        const response = await syncCallBackRequest();
        return {
            data: response.data,
            status: response.status >= 200 && response.status < 300
        };
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            console.error("Request timed out");
        } else {
            console.error("API error:", error.message);
        }
        return {
            error: error.message,
            status: false
        };
    }
};

export { fetchAPI, fetchResponse };
