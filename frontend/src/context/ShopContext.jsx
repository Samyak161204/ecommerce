import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if no token, except for login and reset-password routes
  useEffect(() => {
    if (!token && !['/login', '/reset-password'].some(path => location.pathname.startsWith(path))) {
      navigate("/login");
    } else if (token) {
      fetchCartData(); // Fetch cart data on reload
    }
  }, [token, navigate, location.pathname]);

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  // Fetch Cart from DB on Reload
  const fetchCartData = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart data");
    }
  };

  // Add to Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (!updatedCart[itemId]) {
        updatedCart[itemId] = {};
      }
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Error adding to cart");
      }
    }
  };

  // Update Quantity in Cart
  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (quantity === 0) {
        delete updatedCart[itemId][size];
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
      } else {
        updatedCart[itemId][size] = quantity;
      }
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Error updating cart");
      }
    }
  };

  // Get Cart Count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((totalCount, sizes) => {
      return totalCount + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
    }, 0);
  };

  // Get Cart Amount
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        return totalAmount + Object.values(sizes).reduce((sum, qty) => sum + itemInfo.price * qty, 0);
      }
      return totalAmount;
    }, 0);
  };

  // Fetch Products
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Some unexpected error occured");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products");
    }
  };

  // Send OTP
  const sendOtp = async (email) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/send-otp`, { email });
      if (response.data.success) {
        setOtpSent(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "OTP hasn't been sent");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending OTP");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    logout,
    sendOtp,
    otpSent,
    setOtpSent
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;