import api from "./api";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    name?: string;
    role: 'user' | 'moderator' | 'admin';
    createdAt: string;
    updatedAt: string;
    refreshToken: string | null;
}

export const getMe = async () => {
    const res = await api.get("/user/me");
    return res.data;
};


export const updateMe = async (updateData: Record<string, any>) => {
    const res = await api.put("/user/me", updateData);
    return res.data;
};


export const deleteMe = async () => {
    const res = await api.delete("/user/me");
    return res.data;
};


//moderator or admin service

export const getAllUsers = async () => {
    const res = await api.get("/mod/user");
    return res.data;
}

export const deleteUser = async (id: string) => {
    const res = await api.delete(`/mod/user/${id}`);
    return res.data;
}

export const updateUserRole = async (id: string, role: string) => {
    const res = await api.patch(`/admin/${id}/role`, { role });
    return res.data;
};