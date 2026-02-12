import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "IDR";

  // ==========================
  // State
  // ==========================
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);


  // ==========================
  // Helper Functions
  // ==========================
  const formatPrice = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // ==========================
  // Fetch Functions
  // ==========================
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {}); // fallback supaya aman
      }
    } catch {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==========================
  // Cart Functions
  // ==========================
const addToCart = (itemId, { showPopup = true } = {}) => {
  const cartData = { ...cartItems };
  cartData[itemId] = (cartData[itemId] || 0) + 1;
  setCartItems(cartData);
  toast.success("Added to cart");

  // hanya munculin popup jika showPopup true
  if (showPopup) {
    setShowCartPopup(true);

  }
};



  const updateCartItem = (itemId, quantity) => {
    const cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    const cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Removed from cart");
  };

  const getCartCount = () => {
    if (!cartItems || typeof cartItems !== "object") return 0;
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) totalAmount += product.price * cartItems[id];
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ==========================
  // Orders
  // ==========================
  const placeOrder = async ({ customerName, tableNumber, paymentMethod }) => {
    try {
      const items = Object.entries(cartItems).map(([id, qty]) => ({
        product: id,
        quantity: qty,
      }));

      const { data } = await axios.post("/api/order/pay", {
        items,
        customerName,
        tableNumber,
        paymentMethod,
      });

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        navigate("/my-orders");
        fetchOrders(); // ✅ ambil ulang orders setelah order baru dibuat
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==========================
  // Effects
  // ==========================
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      fetchOrders(); // ✅ fetch orders tiap kali user login/berubah
    }
  }, [user]);

  // ==========================
  // Context Value
  // ==========================
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    formatPrice,
    setSearchQuery,
    searchQuery,
    getCartCount,
    getCartAmount,
    orders,
    setOrders,
    fetchOrders,
    placeOrder,
    axios,
    fetchProducts,
    setCartItems,
    showCartPopup,
    setShowCartPopup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
