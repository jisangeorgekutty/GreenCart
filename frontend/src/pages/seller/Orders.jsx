import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';

function Orders() {
    const { getAllUersOrder, allOrders } = useOrderStore();
    const { authUser } = useAuthStore();


    useEffect(() => {
        if (authUser) {
            getAllUersOrder();
        }
    }, [authUser]);
    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>

                {allOrders.map((order, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 max-w-4xl rounded-md border border-gray-300"
                    >
                        {/* Column 1: Products */}
                        <div className="flex gap-3">
                            <img
                                className="w-12 h-12 object-cover"
                                src={assets.box_icon}
                                alt="boxIcon"
                            />
                            <div>
                                {order.items.map((item, idx) => (
                                    <p key={idx} className="font-medium">
                                        {item.productName}{" "}
                                        <span className="text-primary">x {item.quantity}</span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Customer info */}
                        <div className="text-sm md:text-base text-black/60">
                            <p className="text-black/80 font-medium">{order.name}</p>
                            {/* If order.address is an object */}
                            {typeof order.address === "object" ? (
                                <p>
                                    {order.address.street}, {order.address.city},{" "}
                                    {order.address.state}, {order.address.zipCode}
                                </p>
                            ) : (
                                <p>{order.address}</p>
                            )}
                        </div>

                        {/* Column 3: Amount */}
                        <p className="font-medium text-lg">{`$${order.amount}`}</p>

                        {/* Column 4: Payment & Date */}
                        <div className="text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders