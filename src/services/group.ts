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