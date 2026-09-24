import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { getOrders } from "../api/cart";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrders();

        setOrders(response.data);
      } catch (err) {
        console.error(
          "Could not load orders:",
          err
        );

        setError(
          "We couldn't load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6f2]">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <p className="text-sm text-[#817b75]">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2]">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <Link
          to="/"
          className="
            inline-flex items-center gap-2
            text-sm font-medium text-[#817b75]
            transition hover:text-[#b5202d]
          "
        >
          <ArrowBackRoundedIcon
            sx={{ fontSize: 18 }}
          />
          Continue shopping
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
            Ivory & Ink
          </p>

          <h1 className="mt-2 font-['Playfair'] text-4xl font-semibold text-[#171717]">
            My Orders
          </h1>

          <p className="mt-3 text-sm text-[#817b75]">
            View your previous purchases and
            order details.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#ead0d3] bg-white px-5 py-4 text-sm text-[#b5202d]">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#e2ddd6] bg-white px-8 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ece6] text-[#b5202d]">
              <ShoppingBagOutlinedIcon
                sx={{ fontSize: 26 }}
              />
            </div>

            <h2 className="mt-5 font-['Playfair'] text-2xl font-semibold text-[#171717]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#817b75]">
              When you place an order, you'll
              be able to find it here.
            </p>

            <Link
              to="/"
              className="
                mt-6 inline-flex rounded-xl
                bg-[#171717] px-6 py-3
                text-sm font-semibold text-white
                transition hover:bg-[#b5202d]
              "
            >
              Browse books
            </Link>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="
                  overflow-hidden rounded-3xl
                  border border-[#e2ddd6]
                  bg-white
                "
              >
                <div className="flex flex-col gap-4 border-b border-[#eee9e2] bg-[#fcfbf9] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a948e]">
                      Order
                    </p>

                    <p className="mt-1 font-mono text-xs text-[#171717]">
                      {order.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-[#9a948e]">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#171717]">
                        {formatDate(
                          order.created_at
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9a948e]">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#171717]">
                        $
                        {Number(
                          order.total
                        ).toFixed(2)}
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full bg-[#f2ede7]
                        px-3 py-1.5
                        text-xs font-semibold
                        capitalize text-[#6f6963]
                      "
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#eee9e2]">
                  {order.items.map((item) => (
                    <div
                      key={item.book_id}
                      className="flex gap-5 px-6 py-5"
                    >
                      <Link
                        to={`/books/${item.book_id}`}
                        className="
                          flex h-[105px] w-[72px]
                          shrink-0 items-center
                          justify-center overflow-hidden
                          rounded-lg bg-[#f1ece6]
                        "
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MenuBookRoundedIcon
                            sx={{
                              fontSize: 25,
                              color: "#aaa49d",
                            }}
                          />
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <Link
                          to={`/books/${item.book_id}`}
                          className="
                            font-['Playfair']
                            text-lg font-semibold
                            text-[#171717]
                            transition
                            hover:text-[#b5202d]
                          "
                        >
                          {item.title}
                        </Link>

                        <p className="mt-1 text-sm text-[#817b75]">
                          {item.authors}
                        </p>

                        <div className="mt-3 flex items-center gap-5 text-sm">
                          <span className="text-[#817b75]">
                            Ouantity:{" "}
                            <span className="font-medium text-[#171717]">
                              {item.quantity}
                            </span>
                          </span>

                          <span className="text-[#817b75]">
                            Price $
                            <span className="font-medium text-[#171717]">
                                {Number(item.unit_price).toFixed(2)}
                            </span>
                          </span>
                          
                        </div>
                      </div>

                      <div className="hidden items-center sm:flex">
                        <p className="font-semibold text-[#171717]">
                          $
                          {(
                            Number(
                              item.unit_price
                            ) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end bg-[#fcfbf9] px-6 py-5">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9a948e]">
                      Order total
                    </p>

                    <p className="mt-1 font-['Playfair'] text-xl font-semibold text-[#171717]">
                      $
                      {Number(
                        order.total
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;