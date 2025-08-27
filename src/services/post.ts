import api from "./api"

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    likes: string[];
    dislikes: string[];
    images: string[];
}

export const getPosts = async () => {
    const res = await api.get("/post");
    return res.data;
}

export const getPostById = async (id: string) => {
    const res = await api.get(`/post/${id}`);
    return res.data;
}

export const createPost = async (
  data: { title: string; content: string; topic: string; images?: File[] }
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("topic", data.topic);

  if (data.images) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  return api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePost = async (
  id: string,
  data: { title: string; content: string; topic: string; images?: File[] }
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("topic", data.topic);

  if (data.images) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  return api.put(`/post/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const getPostByUser = async (id: string) =>{
    const res = await api.get(`/post/user/${id}`);
    return res.data;
}