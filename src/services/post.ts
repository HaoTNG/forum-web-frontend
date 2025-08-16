import api from "./api"

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
}

export const getPosts = async () => {
    const res = await api.get("/post");
    return res.data;
}

export const getPostById = async (id: string) => {
    const res = await api.get(`/post/${id}`);
    return res.data;
}

export const createPost = async (data: { title: string; content: string; topic: string  }) => {
    return api.post("/post", data);
};

export const updatePost = async (id: string, data: {title: string; content: string; topic: string}) =>{
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
export const deletePostByMod = async (id: string) => {
    const res = await api.delete(`/mod/${id}`);
    return res.data;
}

export const searchPost = async (query: string) => {
    const encodedQuery = encodeURIComponent(query.trim());
    const res = await api.get(`/search?q=${encodedQuery}`);
    return res.data;
};
