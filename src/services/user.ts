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

export const uploadAvatar = async (userId: string, file: File) =>{
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post(`/user/avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, 
    });

    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Upload avatar failed" };
  }
};

export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username.trim()) return false;

  try {
    const res = await api.get(`/user/check-username`, {
      params: { username }
    });
    
    return res.data?.available ?? false;
  } catch (err) {
    console.error("Check username failed:", err);
    return false;
  }
};
