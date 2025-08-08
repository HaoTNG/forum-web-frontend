import api from "./api"



export const getPosts = async () => {
    const res = await api.get("/post");
    return res.data;
}

export const getPostById = async (id: string) => {
    const res = await api.get(`/post/${id}`);
    return res.data;
}

export const createPost = async (data: { title: string; content: string; author: string | null }) => {
    return api.post("/post", data);
};

export const updatePost = async (id: string, data: {title: string; content: string}) =>{
    return api.put(`/post/${id}`, data)
};

export const deletePost = async (id: string) => {
    return api.delete(`/post/${id}`);
}

export const likePost = async (id: string) => {
    const res = await api.put(`/post/${id}/like`);
    return res.data;
}
export const dislikePost = async (id: string) => {
    const res = await api.put(`/post/${id}/dislike`);
    return res.data;
}