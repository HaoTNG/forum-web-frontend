import api from "./api"

export const getPosts = async () => {
    const res = await api.get("/post");
    return res.data;
}

export const getPostById = async (id: string) => {
    const res = await api.get(`/post/${id}`);
    return res.data;
}

export const createPost = async (title:string, content:string, author: string) => {
    const res = await api.post("/post", {title,content,author});
    return res.data;
}