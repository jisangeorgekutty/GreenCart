import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAddressStore = create((set, get) => ({
    addressList: {},

    addAddress: async ({ address, UserId }) => {
        try {
            console.log("Adding address for user:", UserId);
            console.log("Address data:", address);
            const payload = { ...address, UserId };
            const res = await axiosInstance.post('/address/add', payload);
            if (res.data.success) {
                toast.success(res.data.message);
                await get().getUserAddress({ userId: UserId });
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Add address error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

    getUserAddress: async ({ userId }) => {
        try {
            const res = await axiosInstance.get(`/address/get?userId=${userId}`);
            set({ addressList: res.data.address });
            console.log("Address", res.data.address)
        } catch (error) {
            console.error("Add address error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

}))