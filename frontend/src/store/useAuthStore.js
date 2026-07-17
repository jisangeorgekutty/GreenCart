import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useCartStore } from "./useCartStore.js";
import { jwtDecode } from "jwt-decode";




export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSeller: false,
    setUserLoginWindow: false,
    isSigningUp: false,
    isLoggingIn: false,

    isCheckingAuth: true,
    isCheckingAuthSeller: true,

    loginUserWindow: async (value) => {
        set({ setUserLoginWindow: value });
    },
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            if (res.data.success) {
                const token = localStorage.getItem("token");
                let isSellerValue = false;
                if (token) {
                    const decoded = jwtDecode(token);
                    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    isSellerValue = role?.toLowerCase() === "admin";
                }
                console.log("Role", isSellerValue);
                set({
                    authUser: res.data.user,
                    isSeller: isSellerValue,
                });
                console.log("User Authenticated:", res.data.user);
                const { setCartItems } = useCartStore.getState();
                setCartItems(res.data.user.cartItems);
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            set({ authUser: null });
            // console.error("Error in userAuth:", error.message);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    userLogin: async (email, password) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            const decoded = jwtDecode(res.data.accessToken);
            console.log("Decoded data", decoded);
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const isSellerValue = role?.toLowerCase() === "admin";
            set({ isSeller: isSellerValue });
            console.log("Role", isSellerValue);
            console.log("Response:", res);

            await get().checkAuth();
            set({ setUserLoginWindow: false });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error("Login Failed");
            set({ setUserLoginWindow: true });
        } finally {
            set({ isLoggingIn: false });
        }
    },
    userSignup: async (name, email, password) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/register', { name, email, password });
            toast.success("Account created successfully");
            return true;
        } catch (error) {
            toast.error(error.response.data.message);
            set({ setUserLoginWindow: true });
        } finally {
            set({ isSigningUp: false });
        }
    },
    userLogOut: async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await axiosInstance.post("/auth/logout", { refreshToken });
            set({ authUser: null });
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error("Error logging out");
        }
    }
}))