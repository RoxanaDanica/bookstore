import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../context/CartContext";

import SidebarFilters from "./SidebarFilters";
import LockIcon from "@mui/icons-material/Lock";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthSidePanel from "./AuthSidePanel";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Cart() {
  const {
    cart,
    cartLoading,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
  } = useCart();

  const [authOpen, setAuthOpen] = useState(false);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    genre: [],
    author: [],
    price: [0, 100],
  });

  const handleIncrease = async (item) => {
    const result = await increaseQuantity(item);

    if (!result.success) {
      alert(result.error);
    }
  };

  const handleDecrease = async (item) => {
    const result = await decreaseQuantity(item);

    if (result && !result.success) {
      alert(result.error);
    }
  };

  const handleDelete = async (item) => {
    const result = await deleteItem(item);

    if (!result.success) {
      alert(result.error);
    }
  };

  const getAuthData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  };

  const openAuthPanel = () => {
    const auth = getAuthData();

    if (!auth) {
      setAuthOpen(true);
      return;
    }

    if (auth.type === "guest") {
      const guestCheckoutConfirmed =
        localStorage.getItem("guestCheckoutConfirmed");

      if (guestCheckoutConfirmed === "true") {
        navigate("/checkout");
        return;
      }

      setAuthOpen(true);
      return;
    }

    navigate("/checkout");
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    navigate("/checkout");
  };

  const books = cart?.items || [];
  const items = cart?.items || [];

  if (cartLoading) {
    return <h2>Loading...</h2>;
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[#f8f6f2] px-6 py-20">
        <div className="mx-auto flex max-w-[1400px] justify-center">
          <div className="w-full max-w-[560px] rounded-3xl border border-[#e5dfd7] bg-white px-10 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
              <ShoppingCartIcon sx={{ fontSize: 38 }} />
            </div>

            <span className="mt-8 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
              Your cart
            </span>

            <h2 className="mt-3 font-['Playfair'] text-[34px] font-bold text-[#171717]">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-4 max-w-[400px] text-[15px] leading-7 text-[#77716b]">
              You haven't added any books yet. Explore the collection and find
              something worth reading.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b5202d]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

return (
  <section className="min-h-screen bg-[#f8f6f2] py-16">
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
          Your selection
        </span>

        <h1 className="mt-3 font-['Playfair'] text-[44px] font-bold text-[#171717]">
          Shopping Cart
        </h1>

        <p className="mt-3 text-[15px] text-[#77716b]">
          Review your books and continue when you're ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#e5dfd7] bg-white p-5">
          <SidebarFilters
            books={books}
            filters={filters}
            setFilters={setFilters}
          />
        </aside>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.book_id}
                className="
                  group flex flex-col gap-5 rounded-2xl
                  border border-[#e7e2db] bg-white p-5
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
                  md:flex-row md:items-center md:justify-between
                "
              >
                <div className="flex min-w-0 items-center gap-5">
                  <div className="flex h-[130px] w-[100px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f0ea] p-2">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b958f]">
                      {item.categories}
                    </p>

                    <h3 className="max-w-[420px] font-['Playfair'] text-[21px] font-semibold leading-snug text-[#171717]">
                      {item.title}
                    </h3>

                    {item.authors && (
                      <p className="mt-2 text-sm text-[#77716b]">
                        by {item.authors}
                      </p>
                    )}

                    <p className="mt-3 text-[17px] font-semibold text-[#b5202d]">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 md:flex-nowrap">
                  <div className="flex h-11 items-center overflow-hidden rounded-full border border-[#ddd7d0] bg-[#faf8f5]">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      className="
                        flex h-full w-11 items-center justify-center
                        text-lg text-[#171717]
                        transition hover:bg-[#eee9e2]
                        disabled:cursor-not-allowed disabled:opacity-30
                      "
                    >
                      −
                    </button>

                    <span className="min-w-[42px] text-center text-sm font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item)}
                      className="
                        flex h-full w-11 items-center justify-center
                        text-lg text-[#171717]
                        transition hover:bg-[#eee9e2]
                      "
                    >
                      +
                    </button>
                  </div>

                  <p className="min-w-[90px] text-right text-[17px] font-semibold text-[#171717]">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleDelete(item)}
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full text-[#8c8680]
                      transition
                      hover:bg-[#f7e9e9]
                      hover:text-[#b5202d]
                    "
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit xl:sticky xl:top-[110px]">
            <div className="rounded-2xl border border-[#e5dfd7] bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="font-['Playfair'] text-[28px] font-semibold text-[#171717]">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 border-b border-[#ece7e1] pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#77716b]">
                    Items ({cart.totalItems})
                  </span>

                  <span className="font-medium text-[#171717]">
                    ${cart.cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#77716b]">
                    Shipping
                  </span>

                  <span className="text-sm font-semibold text-[#4e7b5b]">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#77716b]">
                    Taxes
                  </span>

                  <span className="font-medium text-[#171717]">
                    $0.00
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between py-6">
                <div>
                  <p className="text-sm text-[#77716b]">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-[#aaa49d]">
                    Tax excluded
                  </p>
                </div>

                <p className="font-['Playfair'] text-[28px] font-bold text-[#171717]">
                  ${cart.cartTotal.toFixed(2)}
                </p>
              </div>

              <button
                onClick={openAuthPanel}
                className="
                  w-full rounded-xl bg-[#171717] py-4
                  text-sm font-semibold uppercase tracking-[0.08em]
                  text-white transition duration-300
                  hover:bg-[#b5202d]
                "
              >
                Go to Checkout
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#9b958f]">
                Secure checkout. Your cart is reserved while you complete your order.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e5dfd7] bg-[#f3f0ea] p-6">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                    <LockIcon sx={{ fontSize: 20 }} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      Secure checkout
                    </p>

                    <p className="mt-1 text-xs text-[#77716b]">
                      Your information is protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                    <LocalShippingIcon sx={{ fontSize: 20 }} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      Reliable delivery
                    </p>

                    <p className="mt-1 text-xs text-[#77716b]">
                      Fast and carefully handled shipping.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                    <ThumbUpIcon sx={{ fontSize: 20 }} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      Easy returns
                    </p>

                    <p className="mt-1 text-xs text-[#77716b]">
                      Simple return policy if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthSidePanel
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  </section>
);
}