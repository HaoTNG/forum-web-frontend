import api from "./api";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    name?: string;
    avatarUrl: string;
    role: 'user' | 'moderator' | 'admin';
    description: string;
    createdAt: string;
    updatedAt: string;
    refreshToken: string | null;
    posts: string[];      
    comments: string[];   
    score: number;
}


export interface Contributor {
    _id: string;
    username: string;
    postCount: number;
    commentCount: number;
    score: number;
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

export const getTopContributors = async () => {
    const res = await api.get("/user/top-contributors");
    return res.data;
}