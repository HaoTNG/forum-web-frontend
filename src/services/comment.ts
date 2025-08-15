import api from "./api.ts";


export interface Comment {
    _id: string;
    content: string;
    postId: string;
    author: {
        _id: string;
        username: string;
    };
    createdAt: string;
    parent?: string | null;
    replies?: Comment[];
}

export const getCommentByPostId = async (postId: string) => {
    const res = await api.get(`/comment/get/${postId}`);
    return res.data;
}

export const createComment = async (content: string, postId: string, parentComment: string | null) =>{
    const res = await api.post(`/comment`, {content, postId, parentComment});
    return res.data;
}
export const deleteComment = async (id: string) => {
    const res = await api.delete(`/comment/${id}`);
    return res.data;
}

export const deleteCommentByMod = async (id: string) =>{
    const res = await api.delete(`/mod/comment/${id}`);
    return res.data;
}