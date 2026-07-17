import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useOrderStore = create((set, get) => ({
    userOrders: [],
    allOrders: [],

    userPlaceOrderCod: async ({ userId, items, address }) => {
        console.log("Placing COD order for user:", userId, "with items:", items, "and address:", address);
        try {
            const res = await axiosInstance.post('/order/cod', {
                userId,
                items: items.map(i => ({
                    productId: i.product, // rename key
                    quantity: i.quantity
                })),
                address: `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`
            })
            if (res.data.success) {
                toast.success(res.data.message);
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

    userPlaceOrderMyFatoorah: async ({ userId, items, address }) => {
        console.log("Placing MyFatoorah order for user:", userId, "with items:", items, "and address:", address);
        try {
            const res = await axiosInstance.post('/order/myfatoorah', {
                userId,
                items: items.map(i => ({
                    productId: i.product,
                    quantity: i.quantity
                })),
                address: address
            })
            if (res.data.success) {
                toast.success(res.data.message);
                console.log(res.data.url);
                return { success: res.data.success, message: res.data.message, url: res.data.url };
            }
        } catch (error) {
            console.error("Something went wrong, address and items are required", error);
            return { success: false, message: "Network or server error. Please try again.", url: "" };
        }
    },

    getUserOrders: async ({ userId }) => {
        try {
            const res = await axiosInstance.get('/order/user', {
                params: { userId }
            });
            if (res.data.success) {
                set({ userOrders: res.data.orders });
                toast.success("User Orders Fetched")
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

    getAllUersOrder: async () => {
        try {
            const res = await axiosInstance.get('/order/all');
            if (res.data.success) {
                set({ allOrders: res.data.orders });
                console.log("All Orders Fetched", res.data.orders);
                toast.success("All Orders Fetched");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
}))