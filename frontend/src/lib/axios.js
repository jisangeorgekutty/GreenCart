import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5233/api"
            : "/api",
    withCredentials: true,
});

// Attach token automatically for every request
axiosInstance.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return req;
});
