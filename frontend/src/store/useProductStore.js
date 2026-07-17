import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';


export const useProductStore = create((set, get) => ({
    searchQueryData: "",
    products: [],

    isProductAdding: false,
    setSearchQueryData: (value) => {
        set({ searchQueryData: value });
    },

    addToProduct: async (productData) => {
        set({ isProductAdding: true })
        try {
            const res = await axiosInstance.post('/products/add', productData);
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Add product error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "failed to add product");
            return false;
        } finally {
            set({ isProductAdding: false })
        }
    },

    getAllProducts: async () => {
        try {
            const res = await axiosInstance.get('/products/list');
            if (res.data.success) {
                set({ products: res.data.product });
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || error.message || "Something went wrong"
            );
        }
    },

    

    toggleStock: async (id, inStock) => {
        try {
            console.log("Toggling stock for product ID:", id, "to inStock:", inStock);
            const res = await axiosInstance.put(`/products/${id}/stock?inStock=${inStock}`);
            set(state => ({
                products: state.products.map(product =>
                    product.id === id ? { ...product, inStock } : product
                )
            }));
            toast.success("Stock status updated successfully");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }




}));
