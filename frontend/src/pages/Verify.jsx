import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const userId = searchParams.get("userId"); // Ensure userId is also extracted if needed

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!token || !orderId) {
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId, userId }, // Ensure userId is passed if required
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setCartItems({});
           navigate("/orders");
        } else {
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error(error.response?.data?.message || "Payment verification failed.");
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [token, orderId, userId, success, navigate, backendUrl, setCartItems]);

  return <div>Verifying Payment...</div>;
};

export default Verify;
