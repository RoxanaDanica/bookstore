import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviews, addReview, getBook } from "../api/books";

import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
            const bookRes = await getBook(id);
            setBook(bookRes);
            const reviewsRes = await getReviews(id);
            setReviews(reviewsRes);
            } catch(err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddReview = async () => {
        if (!comment.trim()) return;
        try {
            const newReview = await addReview({
            bookId: id,
            userId: 1, 
            rating,
            comment,
            });

            setReviews((prev) => [newReview, ...prev]);
            setComment("");
            setRating(5);
        } catch (err) {
            console.log(err);
        }
    };
    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
            stars.push(
                <StarOutlinedIcon
                key={i}
                sx={{ color: "#f5a623", fontSize: 18 }}
                />
            );
            } else {
            stars.push(
                <StarBorderPurple500OutlinedIcon
                key={i}
                sx={{ color: "#ccc", fontSize: 18 }}
                />
            );
            }
        }
        return stars;
    }

    if (loading) return <div className="p-10 text-gray-500">Loading...</div>;
    if (!book) return <div className="p-10 text-red-500">Book not found</div>;
    return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <div className="grid md:grid-cols-2 gap-16">
        <div className="flex justify-center">
            <div className="w-full max-w-sm aspect-[3/4] bg-gray-50 rounded-2xl flex items-center justify-center p-6">
            <img
                src={book.thumbnail}
                alt={book.title}
                className="max-h-full object-contain"
            />
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div>
            <h1 className="text-3xl font-semibold">{book.title}</h1>
            {book.subtitle && (
                <p className="text-gray-500 mt-1">{book.subtitle}</p>
            )}
            <p className="text-gray-500 mt-2">
                by <span className="text-gray-800 font-medium">{book.authors}</span>
            </p>
            </div>
            <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-[#e52334]">
                ${book.price}
            </span>
            <span className="text-sm text-gray-500">
                <StarBorderPurple500OutlinedIcon /> {book.average_rating}
            </span>
            </div>

            <p className="text-gray-700 leading-relaxed">
            {book.description}
            </p>

            <div className="flex gap-3">
            <button className="bg-[#e52334] text-white px-5 py-2 rounded-full hover:cursor-pointer">
                Add to Cart
            </button>
            <button className="border px-5 py-2 rounded-full hover:cursor-pointer">
                Wishlist
            </button>
            </div>
        </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <span className="text-sm text-gray-500">
            {reviews.length} reviews
            </span>
        </div>
        <div className="space-y-4">
            <div>
            <label className="text-sm text-gray-700 font-medium">
                Your rating *
            </label>

            <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map((star) => (
                <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition hover:cursor-pointer ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                    <StarBorderPurple500OutlinedIcon />
                </button>
                ))}
            </div>
            </div>
            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your review *"
            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 min-h-[140px]"
            />
            <button
            onClick={handleAddReview}
            className="bg-[#e52334] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition hover:cursor-pointer"
            >
            Submit
            </button>
        </div>

        <div className="mt-16 space-y-8">
            <h2 className="text-lg font-semibold text-gray-900">
            Customer Reviews
            </h2>
            {reviews.map((r) => (
            <div key={r.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                {r.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                    {r.name || `User ${r.userId}`}
                    </p>
                    <div className="flex text-orange-400 text-sm">
                     {renderStars(r.rating)}
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {r.comment}
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
}