import React, { use, useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { assets, dummyAddress } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAddressStore } from '../store/useAddressStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { useOrderStore } from '../store/useOrderStore';


function Cart() {
    const { cartItems, removeFromCart, getCartCount, updateCartItem, setCartItems, totalCount, getCartAmount, totalAmount, syncCartToDB, loadCartFromDB } = useCartStore();
    const { products } = useProductStore();
    const { getUserAddress, addressList } = useAddressStore();
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const { userPlaceOrderCod, userPlaceOrderMyFatoorah } = useOrderStore();

    console.log("cartItems:", cartItems);

    useEffect(() => {
        if (Object.keys(cartItems).length > 0 && products.length > 0) {
            getCartAmount(products);
        }
    }, [cartItems, products]);

    useEffect(() => {
        const itemsArray = Object.values(cartItems);
        setCartArray(itemsArray);
    }, [cartItems]);

    useEffect(() => {
        if (authUser) {
            getUserAddress({ userId: authUser.id });
        }
    }, [authUser]);

    console.log("Address List:", addressList);

    useEffect(() => {
        if (addressList.length > 0) {
            setAddresses(addressList);
            setSelectedAddress(addressList[0]);
        }
    }, [addressList]);

    useEffect(() => {
        getCartCount();
    }, [cartItems]);

    useEffect(() => {
        if (authUser) {
            loadCartFromDB({ userId: authUser.id });
        }
    }, [authUser])


    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please Select An Address");
            }

            if (paymentOption === "COD") {
                const result = await userPlaceOrderCod({
                    userId: authUser.id,
                    items: cartArray.map(item => ({ product: item.id, quantity: item.quantity })),
                    address: selectedAddress
                })
                if (result?.success) {
                    setCartItems({});
                    await syncCartToDB(authUser.id, {});
                    navigate("/my-orders");
                }
            } else {
                console.log("selected")
                const result = await userPlaceOrderMyFatoorah({
                    userId: authUser.id,
                    items: cartArray.map(item => ({ product: item.id, quantity: item.quantity })),
                    address: selectedAddress
                })
                if (result?.success) {
                    console.log("redirect to the url")
                    window.location.replace(result.url);
                } else {
                    toast.error(result.message);
                }
            }


        } catch (error) {
            toast.error("Failed to place order");
            console.error("Order Error:", error);
        }
    }



    return cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{totalCount}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => { navigate(`/all-products/${product.category.toLowerCase()}/${product.id}`); scrollTo(0, 0) }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={(e) => updateCartItem(product.id, Number(e.target.value))} value={product.quantity} className='outline-none'>
                                            {Array(cartItems[product.id] > 9 ? cartItems[product.id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">${product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product.id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
                        </button>
                    </div>)
                )}

                <button onClick={() => { navigate("/all-products"); scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} className='group-hover:-translate-x-1 transition' alt="arrow" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street} ,${selectedAddress.city}, ${selectedAddress.state} ,${selectedAddress.country}` : "No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index) => (
                                    <p key={index} onClick={() => { setSelectedAddress(address); setShowAddress(false) }} className="text-gray-500 p-2 hover:bg-gray-100">
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                ))}
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary-dull">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>${totalAmount}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>${totalAmount * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>${totalAmount + totalAmount * 2 / 100}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null
}

export default Cart