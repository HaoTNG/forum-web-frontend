import api from "./api"

export const followUser = async (id: string) => {
  const res = await api.post(`/${id}/follow`); 
  return res.data;
};

export const unfollowUser = async (id: string) => {
  const res = await api.delete(`/${id}/unfollow`); 
  return res.data;
};

export const getFollowersCount = async (id: string) => {
  const res = await api.get(`/${id}/followers/count`);
  return res.data; 
};

export const getFollowingCount = async (id: string) => {
  const res = await api.get(`/${id}/following/count`);
  return res.data; // { followingCount: number }
};

export const isFollowing = async (id: string) => {
  const res = await api.get(`/${id}/status`);
  return res.data; 
};