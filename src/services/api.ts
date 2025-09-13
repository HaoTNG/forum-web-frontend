import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 từ login/register/refresh thì bỏ qua
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !["/auth/login", "/auth/register", "/auth/refresh"].some((url) =>
        originalRequest.url?.includes(url)
      )
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError: any) {
        if (refreshError.response?.data?.message === "missing refresh token") {
          return Promise.reject(refreshError);
        }
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export default api;
