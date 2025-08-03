import api from "./api";

export const loginUser = async (email: string, password: string) =>{
    const res = await api.post("/auth/login", {email, password});
    return res.data;
}

export const registerUser = async (email: string, password: string, name: string, username: string) =>{
    const res = await api.post("/auth/register", {email, password, username, name});
    return res.data;
}

