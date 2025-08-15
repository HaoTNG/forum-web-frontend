import api from "./api";
import {clearTokens} from "./tokenManager.ts";

export const loginUser = async (email: string, password: string) =>{
    const res = await api.post("/auth/login", {email, password});
    return res.data;
}

export const registerUser = async (email: string, password: string, name: string, username: string) =>{
    const res = await api.post("/auth/register", {email, password, username, name});
    return res.data;
}

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        console.warn("No refresh token found");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
    }

    try {
        await api.post("/auth/logout", { refreshToken });
    } catch (error) {
        console.error("Logout API error:", error);
    } finally {
        clearTokens();
        window.location.href = "/login";
    }
};

