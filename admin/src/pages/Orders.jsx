import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const authToken = localStorage.getItem("authToken"); // Directly get the token from localStorage
        if (!authToken) {
            console.log("Token not found");
            return; // Stop execution if token is not found
        }
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/list`,
                {},
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching orders:", error);
        }
    };

    const statusHandler = async (event, orderId) => {
        const authToken = localStorage.getItem("authToken"); // Get token inside the function
    
        if (!authToken) {
            toast.error("Unauthorized: Please log in again.");
            return;
        }
    
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/status`,
                { orderId, status: event.target.value },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
    
            if (response.data.success) {
                toast.success("Order status updated successfully!");
                await fetchAllOrders(); // Fetch updated orders list
            } else {
                toast.error(response.data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };
    

    useEffect(() => {
        fetchAllOrders();
    }, []); // Empty dependency array so the effect runs only once

    return (
        <div>
            <h3>Order Page</h3>
            <br />
            <div>
                {
                    orders.map((order, index) => (
                        <div key={index} className="border-b-2 border-gray-300 pb-4 mb-4">
                            <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] sm:flex-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_10fr] gap-3 items-start border-2 border-gray-500 py-2 px-3 shadow-lg bg-white p-5 md:p-8 text-xs sm:text-sm text-gray-700">
                                <img className="w-12" src={assets.parcel_icon} alt="" />
                                <div>
                                    <div>
                                        {order.items.map((item, index) => (
                                            <p className="py-0.5" key={index}>{item.name} x {item.quantity} <span>{item.size}</span>{index !== order.items.length - 1 ? ',' : ''}</p>
                                        ))}
                                    </div>
                                    <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
                                    <div>
                                        <p>{order.address.street + ","}</p>
                                        <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                    </div>
                                    <p>{order.address.phone}</p>
                                    <br />
                                </div>
                                <div>
                                    <p className="text-sm sm:text-[15px]">Items : {order.items.length}</p>
                                    <br />
                                    <p>Method : {order.paymentMethod}</p>
                                    <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                                    <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
                                <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="p-2 font-semi-bold border border-gray-400 rounded">
                                    <option value="Order Placed">Order Placed</option> 
                                    <option value="Packing">Packing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Orders;