import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviews, addReview, getBook } from "../api/books";
import { useCart } from "../context/CartContext";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { addToCart } = useCart();

    const [cartMessage, setCartMessage] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const bookRes = await getBook(id);
            setBook(bookRes);

            const reviewsRes = await getReviews(id);

            setReviews(reviewsRes);
            } catch (err) {
            console.log(err);
            } finally {
            setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = async () => {
        if (addingToCart) return;

        setAddingToCart(true);

        try {
            const result = await addToCart(book.id, 1);

            if (result.success) {
            setCartMessage("Added to your bag");
            } else {
            setCartMessage(result.error || "Unable to add book");
            }

            setTimeout(() => {
            setCartMessage("");
            }, 2000);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddReview = async () => {
        if (!comment.trim() || rating === 0) return;

        try {
            await addReview({
            bookId: id,
            rating,
            comment,
            });

            const reviewsRes = await getReviews(id);
            setReviews(reviewsRes);

            setComment("");
            setRating(0);
        } catch (err) {
            console.log(err);
        }
    };

    function renderStars(rating) {
    return [1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
        <StarRoundedIcon
            key={star}
            sx={{ color: "#d8a536", fontSize: 18 }}
        />
        ) : (
        <StarBorderRoundedIcon
            key={star}
            sx={{ color: "#d4cec7", fontSize: 18 }}
        />
        )
    );
    }

   if (loading) {
  return (
    <section className="min-h-[70vh] bg-[#f8f6f2] px-6 py-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center py-32">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#ddd7d0] border-t-[#b5202d]" />

          <p className="mt-4 text-sm text-[#8b8580]">
            Loading book...
          </p>
        </div>
      </div>
    </section>
  );
}

if (!book) {
  return (
    <section className="min-h-[70vh] bg-[#f8f6f2] px-6 py-20">
      <div className="mx-auto max-w-[560px] rounded-3xl border border-[#e5dfd7] bg-white px-10 py-16 text-center">
        <AutoStoriesOutlinedIcon
          sx={{ fontSize: 42, color: "#b5202d" }}
        />

        <h2 className="mt-5 font-['Playfair'] text-[30px] font-semibold text-[#171717]">
          Book not found
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#8b8580]">
          We couldn't find the book you're looking for.
        </p>
      </div>
    </section>
  );
}

return (
  <main className="bg-[#f8f6f2]">
    <section className="mx-auto max-w-[1400px] px-6 py-14 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        
        <div>
            <div
            className="
                flex min-h-[560px] items-center justify-center
                rounded-[28px] bg-[#efeae3] p-10
            "
            >
            <img
              src={book.thumbnail}
              alt={book.title}
              className="
                max-h-[480px] max-w-[78%]
                object-contain
                drop-shadow-[0_22px_22px_rgba(0,0,0,0.16)]
              "
            />
          </div>
        </div>

        <div className="flex flex-col justify-center py-3">
          {book.categories && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
              {book.categories}
            </p>
          )}

          <h1 className="max-w-[700px] font-['Playfair'] text-[42px] font-semibold leading-[1.1] text-[#171717] md:text-[52px]">
            {book.title}
          </h1>

          {book.subtitle && (
            <p className="mt-4 max-w-[650px] text-[17px] leading-7 text-[#77716b]">
              {book.subtitle}
            </p>
          )}

          <p className="mt-5 text-sm text-[#8b8580]">
            by{" "}
            <span className="font-semibold text-[#171717]">
              {book.authors}
            </span>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <StarRoundedIcon
                sx={{
                  fontSize: 21,
                  color: "#d8a536",
                }}
              />

              <span className="font-semibold text-[#171717]">
                {Number(book.average_rating || 0).toFixed(1)}
              </span>
            </div>

            <span className="h-4 w-px bg-[#d8d2cb]" />

            <span className="text-sm text-[#8b8580]">
              {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="mt-8 border-y border-[#e1dbd4] py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a948e]">
              Price
            </p>

            <p className="mt-1 font-['Playfair'] text-[34px] font-semibold text-[#b5202d]">
              ${Number(book.price).toFixed(2)}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="font-['Playfair'] text-[20px] font-semibold text-[#171717]">
              About this book
            </h3>

            <p className="mt-4 max-w-[700px] text-[15px] leading-8 text-[#68625d]">
              {book.description}
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="
                flex min-h-[52px] flex-1 items-center justify-center gap-2
                rounded-xl bg-[#171717] px-8
                text-sm font-semibold text-white
                transition
                hover:bg-[#b5202d]
                disabled:cursor-not-allowed
                disabled:opacity-50
                hover:cursor-pointer
              "
            >
              {cartMessage === "Added to your bag" ? (
                <>
                  <CheckRoundedIcon sx={{ fontSize: 20 }} />
                  Added to bag
                </>
              ) : (
                <>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                  {addingToCart ? "Adding..." : "Add to bag"}
                </>
              )}
            </button>

            <button
              type="button"
              className="
                flex min-h-[52px] items-center justify-center gap-2
                rounded-xl border border-[#d8d2cb] bg-transparent
                px-7 text-sm font-semibold text-[#171717]
                transition
                hover:border-[#171717]
                hover:bg-white
                hover:cursor-pointer
              "
            >
              <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
              Wishlist
            </button>
          </div>

          {cartMessage && cartMessage !== "Added to your bag" && (
            <p className="mt-3 text-sm font-medium text-[#b5202d]">
              {cartMessage}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-[#e2dcd5] bg-[#f3f0ea] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#b5202d]">
                <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Fast delivery
                </p>

                <p className="mt-1 text-xs text-[#8b8580]">
                  Carefully packed and delivered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[#e2dcd5] bg-[#f3f0ea] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#b5202d]">
                <LockOutlinedIcon sx={{ fontSize: 19 }} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Secure checkout
                </p>

                <p className="mt-1 text-xs text-[#8b8580]">
                  Safe and protected purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-t border-[#e5dfd7] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
              Share your thoughts
            </p>

            <h2 className="mt-3 font-['Playfair'] text-[34px] font-semibold text-[#171717]">
              Write a review
            </h2>

            <p className="mt-3 max-w-[420px] text-sm leading-7 text-[#817b75]">
              Finished reading this book? Let other readers know what
              you thought about it.
            </p>

            <div className="mt-8">
              <label className="text-sm font-semibold text-[#171717]">
                Your rating
              </label>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} star rating`}
                    className="transition hover:scale-110 hover:cursor-pointer"
                  >
                    {rating >= star ? (
                      <StarRoundedIcon
                        sx={{
                          color: "#d8a536",
                          fontSize: 30,
                        }}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{
                          color: "#cfc8c0",
                          fontSize: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-[#171717]">
                Your review
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think about this book?"
                className="
                  mt-3 min-h-[160px] w-full resize-none
                  rounded-xl border border-[#ddd7d0]
                  bg-[#faf9f7] p-4
                  text-sm leading-6 text-[#171717]
                  outline-none transition
                  placeholder:text-[#aaa49d]
                  focus:border-[#b5202d]
                  focus:bg-white
                "
              />
            </div>

            <button
              type="button"
              onClick={handleAddReview}
              disabled={!comment.trim() || rating === 0}
              className="
                mt-4 rounded-xl bg-[#171717]
                px-7 py-3.5 text-sm font-semibold text-white
                transition
                hover:bg-[#b5202d]
                disabled:cursor-not-allowed
                disabled:opacity-40
                hover:cursor-pointer
              "
            >
              Submit review
            </button>
          </div>

          <div>
            <div className="flex items-end justify-between border-b border-[#e5dfd7] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
                  Reader opinions
                </p>

                <h2 className="mt-2 font-['Playfair'] text-[30px] font-semibold text-[#171717]">
                  Customer Reviews
                </h2>
              </div>

              <span className="rounded-full bg-[#f3f0ea] px-3 py-1.5 text-xs font-semibold text-[#77716b]">
                {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="py-14 text-center">
                <StarBorderRoundedIcon
                  sx={{
                    fontSize: 38,
                    color: "#c9c2ba",
                  }}
                />

                <h3 className="mt-4 font-['Playfair'] text-xl font-semibold text-[#171717]">
                  No reviews yet
                </h3>

                <p className="mt-2 text-sm text-[#8b8580]">
                  Be the first reader to share an opinion.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#eee9e3]">
                {reviews.map((r) => (
                  <article
                    key={r.id}
                    className="py-7 first:pt-7"
                  >
                    <div className="flex gap-4">
                      <div
                        className="
                          flex h-11 w-11 shrink-0 items-center justify-center
                          rounded-full bg-[#efe9df]
                          font-['Playfair'] text-[17px] font-semibold
                          text-[#b5202d]
                        "
                      >
                        {r.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-[#171717]">
                              {r.name || "Reader"}
                            </p>

                            <p className="mt-1 text-xs text-[#aaa49d]">
                              {new Date(
                                r.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex ">
                            {renderStars(r.rating)}
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-[#68625d]">
                          {r.comment}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </main>
);
}