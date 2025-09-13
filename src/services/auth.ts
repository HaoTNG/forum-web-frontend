import api from "./api";

export const getMe = async () => {
  const res = await api.get("/auth/me", { withCredentials: true });
  return res.data; 
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );
  return res.data.user; 
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  username: string
) => {
  const res = await api.post(
    "/auth/register",
    { email, password, username, name },
    { withCredentials: true }
  );
  return res.data; 
};

export const logoutUser = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
  window.location.reload();

  //window.location.replace("/home");
};
