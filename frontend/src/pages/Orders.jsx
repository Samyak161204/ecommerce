import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + '/api/order/userOrders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrderItems.push(item);
          });
        });
        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Function to get color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-500";
      case "Packing":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-purple-500";
      case "Out for Delivery":
        return "bg-orange-500";
      case "Delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="border-t pt-16 px-4 md:px-8 lg:px-12">
      <div className="text-2xl mb-6">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="space-y-6">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 shadow-md bg-white rounded-none text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* Left Section - Image & Details */}
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20 rounded-sm border border-gray-200" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-base text-gray-700">
                  <p className="font-semibold">{currency}{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Date: {new Date(item.date).toDateString()}</p>
                <p className="mt-1 text-sm text-gray-500">Payment: {item.paymentMethod}</p>
              </div>
            </div>

            {/* Right Section - Status & Track Order */}
            <div className="md:w-1/2 flex justify-between items-center">
              {/* Order Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                <p className="text-sm md:text-base font-medium">{item.status}</p>
              </div>

              {/* Track Order Button */}
              <button
                onClick={loadOrderData}
                className="px-4 py-2 text-sm font-semibold border border-gray-400 rounded-none hover:bg-gray-100 transition-all"
              >
                TRACK ORDER
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
