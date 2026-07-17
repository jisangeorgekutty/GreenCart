import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from '../lib/axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const PaymentStatusPage = () => {
    const [paymentResult, setPaymentResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const { clearCart } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        if (paymentId) {
            verifyPayment(paymentId);
        } else {
            setPaymentResult({
                success: false,
                message: "❌ Missing paymentId in URL."
            });
            setLoading(false);
        }
    }, []);


    const verifyPayment = async (paymentId) => {
        try {
            const res = await axiosInstance.get(`/order/verify-payment?paymentId=${paymentId}`);
            setPaymentResult(res.data);
            console.log("Payment verification response:", res.data);
            if (res.data.success) {
                clearCart();
            }
        } catch (err) {
            setPaymentResult({
                success: false,
                message: err.response?.data?.message || "Something went wrong during verification."
            });
        } finally {
            setLoading(false);
        }
    }

    const handleViewOrders = () => {
        navigate('/my-orders');
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800">Verifying payment...</h1>
                    <p className="mt-2 text-gray-600">Please wait, do not close this page.</p>
                </div>
            </div>
        );
    }

    if (!paymentResult) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-500">❌ An unexpected error occurred.</h1>
                    <p className="mt-2 text-gray-600">Please try again or contact support.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-10">
                {paymentResult.success ? (
                    // Success View
                    <div className="text-center">
                        <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">{paymentResult.message}</h1>
                        <p className="text-gray-600 mt-2">Thank you for your order! Your payment was processed successfully.</p>

                        <div className="mt-8 text-left border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700">
                                <div className="space-y-2">
                                    <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
                                    <p>
                                        <strong>Order Date:</strong> {new Date(paymentResult.orderDate).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        <strong>Total Amount:</strong>
                                        <span className="text-green-600 font-bold ml-2">
                                            {paymentResult.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        {paymentResult.orderItems?.length > 0 && (
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-left">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th scope="col" className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider text-center">Quantity</th>
                                                <th scope="col" className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paymentResult.orderItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full" src={item.images?.[0]} alt={item.productName} />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                                                <div className="text-sm text-gray-500">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                        {item.offerPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="mt-10">
                            <button
                                onClick={handleViewOrders}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                View My Orders
                            </button>
                        </div>

                    </div>
                ) : (
                    // Failed View
                    <div className="text-center">
                        <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Failed</h1>
                        <p className="text-gray-600 mt-2">{paymentResult.message}</p>

                        <div className="mt-8">
                            <button
                                onClick={() => window.location.href = '/cart'}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage
