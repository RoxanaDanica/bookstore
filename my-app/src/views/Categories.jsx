import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getBooksCategories } from "../api/books";
import BackButton from "../components/BackButton";

export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const data = await getBooksCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-16">
      <div className="mx-auto max-w-[1400px]">

        <BackButton className="mb-10" />

        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
            Browse by category
          </span>

          <h1 className="font-['Playfair'] text-[44px] font-bold leading-tight text-[#171717] md:text-[52px]">
            Find your next story.
          </h1>

          <p className="max-w-[620px] text-[15px] leading-7 text-[#77716b]">
            Explore our library by category and discover books made
            for every kind of curious mind.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#8b8580]">
              Loading categories...
            </p>
          </div>
        ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => (
                <button
                key={category.categories}
                type="button"
                onClick={() =>
                    navigate(
                    `/books/category/${encodeURIComponent(
                        category.categories
                    )}`
                    )
                }
                className="
                    group min-w-0 text-left
                    transition-transform duration-300
                    hover:-translate-y-1
                    hover:cursor-pointer
                "
                >
                <div
                    className="
                    relative h-[300px] overflow-hidden
                    rounded-[24px] bg-[#ebe7e1]
                    "
                >
                    <img
                    src={
                        category.thumbnail ||
                        "/images/books-banner.jpg"
                    }
                    alt={category.categories}
                    className="
                        h-full w-full object-contain
                        transition-transform duration-700 ease-out
                        group-hover:scale-[1.035]
                    "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                    <div
                    className="
                        absolute left-5 top-5
                        flex h-9 min-w-9 items-center justify-center
                        rounded-full bg-white/90 px-3
                        text-[11px] font-semibold tracking-[0.12em]
                        text-[#171717]
                        backdrop-blur-sm
                    "
                    >
                    {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2
                        className="
                        max-w-[90%]
                        font-['Playfair']
                        text-[26px] font-semibold leading-tight
                        text-white
                        "
                    >
                        {category.categories}
                    </h2>
                    </div>
                </div>

                <div className="flex items-center justify-between px-1 pt-4">
                    <span
                    className="
                        text-[13px] font-medium text-[#77716b]
                        transition-colors
                        group-hover:text-[#b5202d]
                    "
                    >
                    Explore collection
                    </span>

                    <div
                    className="
                        flex items-center gap-1
                        text-[#171717]
                        transition-all duration-300
                        group-hover:translate-x-1
                        group-hover:text-[#b5202d]
                    "
                    >
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
                    </div>
                </div>
                </button>
            ))}
            </div>
        )}
      </div>
    </main>
  );
}