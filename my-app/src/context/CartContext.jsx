import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem
} from "../api/cart";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    cartTotal: 0
    });

    const [cartLoading, setCartLoading] = useState(true);

    const loadCart = async () => {
        try {
            setCartLoading(true);
            const response = await getCart();
            setCart(response.data);
        } catch (err) {
            console.error("LOAD CART ERROR:", err);

            setCart({
            items: [],
            totalItems: 0,
            cartTotal: 0
            });
        } finally {
            setCartLoading(false);
        }
    };

    const addToCart = async (bookId, quantity = 1) => {
    try {
        const response = await addCartItem(bookId, quantity);

        setCart(response.data);

        return { success: true };
    } catch (err) {
        return {
        success: false,
        error:
            err.response?.data?.error ||
            "Unable to add item."
        };
    }
    };

  const increaseQuantity = async (item) => {
    try {
      const response = await updateCartItem(
        item.book_id,
        item.quantity + 1
      );

      setCart(response.data);

      return {
        success: true
      };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error ||
          "Unable to update cart."
      };
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return {
        success: false,
        error: "Quantity cannot be lower than 1."
      };
    }

    try {
      const response = await updateCartItem(
        item.book_id,
        item.quantity - 1
      );

      setCart(response.data);

      return {
        success: true
      };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error ||
          "Unable to update cart."
      };
    }
  };

    const deleteItem = async (item) => {
        try {
            const response = await removeCartItem(item.book_id);

            console.log("DELETE RESPONSE:", response.data);

            setCart(response.data);

            return {
            success: true
            };
        } catch (err) {
            return {
            success: false,
            error:
                err.response?.data?.error ||
                "Unable to remove item."
            };
        }
    };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
        value={{
            cart,
            cartLoading,
            loadCart,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            deleteItem,
            setCart
        }}
    >
    {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};