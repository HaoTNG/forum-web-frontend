import api from "./api"


export const createGroup = async(name: string, description: string) =>{
    const res = await api.post(`/group/create`, {name, description});
    return res.data;
}

export const getGroup = async() =>{
    const res = await api.get(`/group/:id`);
    return res.data;
}

export const joinGroup = async() =>{
    const res = await api.post(`/group/join/:id`);
    return res.data;
}

export const leaveGroup = async() =>{
    const res = await api.post(`/group/leave/:id`);
    return res.data;
}

export const listGroup = async()=>{
    const res = await api.get(`/group/list`);
    return res.data;
}