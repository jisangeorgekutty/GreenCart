import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { axiosInstance } from '../lib/axios';
import { useProductStore } from './useProductStore';

export const useCartStore = create((set, get) => ({
    cartItems: {},
    totalCount: 0,
    totalAmount: 0,


    setCartItems: (items) => {
        set({ cartItems: items || {} });
        get().getCartCount();
    },

    addToCart: async (product) => {
        const cartData = get().cartItems;
        const existingItem = cartData[product.id];

        const updatedCart = {
            ...cartData,
            [product.id]: existingItem
                ? { ...existingItem, quantity: existingItem.quantity + 1 }
                : { ...product, quantity: 1 },
        };

        set({ cartItems: updatedCart });
        console.log("UPDATED CART ", updatedCart);

        if (!existingItem) {
            toast.success(`Added to cart`);
        }


        const { authUser } = useAuthStore.getState();
        console.log("user", authUser);
        if (authUser?.id) {
            await get().syncCartToDB(authUser.id, updatedCart);
        }
    },

    removeFromCart: async (productId) => {
        const cartData = { ...get().cartItems };

        if (cartData[productId]) {
            const updatedQuantity = cartData[productId].quantity - 1;

            if (updatedQuantity > 0) {
                cartData[productId].quantity = updatedQuantity;
            } else {
                delete cartData[productId];
                toast.success("Product Removed from cart");
            }
            set({ cartItems: cartData });

            const { authUser } = useAuthStore.getState();
            if (authUser?.id) {
                await get().syncCartToDB(authUser.id, cartData);
            }
        }
    }
    ,

    updateCartItem: async (productId, quantity) => {
        const cartData = get().cartItems;
        const existingItem = cartData[productId];

        if (existingItem) {
            const updatedCart = {
                ...cartData,
                [productId]: { ...existingItem, quantity },
            };
            set({ cartItems: updatedCart });
            const { authUser } = useAuthStore.getState();
            if (authUser?.id) {
                await get().syncCartToDB(authUser.id, updatedCart);
            }
        }
    },

    getCartCount: () => {
        const cartItems = get().cartItems;
        let count = 0;

        for (const item in cartItems) {
            count += cartItems[item].quantity;
        }
        set({ totalCount: count });
    },

    getCartAmount: (products) => {
        const cartItems = get().cartItems;
        let amount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product.id === itemId);
            if (cartItems[itemId].quantity > 0 && itemInfo) {
                amount += itemInfo.offerPrice * cartItems[itemId].quantity;
            }
        }
        console.log("Final amount calculated:", amount);
        set({ totalAmount: Math.floor(amount * 100) / 100 });
    },

    syncCartToDB: async (userId, cartItems) => {
        console.log("Syncing cart to DB for user:", userId, "with items:", cartItems);
        try {
            const itemsArray = Object.values(cartItems).map(item => ({
                productId: item.id || item.productId,  // assuming product id is stored as `id` or `productId`
                quantity: item.quantity,
                name: item.name,
                offerPrice: item.offerPrice,
                image: item.images?.[0] || item.image, // assuming image is stored as `images` or `image`
                category: item.category
            }));
            const payload = {
                userId,
                cartItems: itemsArray
            };
            const res = await axiosInstance.post("/cart/update", payload);
            // toast.success(res.data.message);
        } catch (error) {
            console.error("Cart sync failed:", error.message);
        }
    },

    clearCart: async () => {
        const { authUser } = useAuthStore.getState();
        const userId = authUser?.id;
        console.log("Clearing cart for user:", userId);
        try {
            const res = await axiosInstance.post(`/cart/clear?userId=${userId}`);
            set({ cartItems: {}, totalCount: 0, totalAmount: 0 });
            toast.success(res.data.message || "Cart cleared successfully");
        } catch (error) {
            console.error("Error clearing cart:", error);

        }
    },

    loadCartFromDB: async ({ userId }) => {
        try {
            const res = await axiosInstance.get('/cart/get', {
                params: { userId }
            });
            const cartObject = {};
            res.data.cartItems.forEach(item => {
                cartObject[item.productId] = {
                    ...item,
                    id: item.productId // keep consistent with frontend usage
                };
            });
            set({ cartItems: cartObject });
            get().getCartCount();
            const { products } = useProductStore.getState();
            // get().getCartAmount(products);
            console.log("Cart loaded from DB:", cartObject);
            console.log("main cart items", res.data);
        } catch (error) {
            console.error("Failed to load cart from DB:", error);
        }
    }
}));
