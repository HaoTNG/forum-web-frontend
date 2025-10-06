import api from "./api"


export interface Group {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  posts: string[];
  memberCount: number;
  isMember: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export const fetchGroupsByUserId = async (userId: string) => {
  const res = await api.get(`/group/user/${userId}`);
  return res.data; 
};


export const createGroup = async(name: string, description: string) =>{
    const res = await api.post(`/group/create`, {name, description});
    return res.data;
}

export const updateGroup = async(id: string, name: string, description: string) =>{
    const res = await api.put(`/group/update/${id}`, {name, description});
    return res.data;
}
export const deleteGroup = async(id: string) =>{
    const res = await api.delete(`/group/delete/${id}`);
    return res.data;
}
export const getGroup = async(id: string) =>{
    const res = await api.get(`/group/${id}`);
    return res.data;
}

export const joinGroup = async(id: string) =>{
    const res = await api.post(`/group/join/${id}`);
    return res.data;
}

export const leaveGroup = async(id: string) =>{
    const res = await api.post(`/group/leave/${id}`);
    return res.data;
}

export const listGroup = async()=>{
    const res = await api.get(`/group/list`);
    return res.data;
}

export const checkMembership = async(id: string) =>{
    const res = await api.get(`/group/${id}/membership`);
    return res.data;
}


export const uploadGroupAvatar = async (groupId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post(`/group/avatar/${groupId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Upload group avatar failed" };
  }
};


export const uploadGroupBanner = async (groupId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("banner", file);

    const res = await api.post(`/group/banner/${groupId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Upload group banner failed" };
  }
};


