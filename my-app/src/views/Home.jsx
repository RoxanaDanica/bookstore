import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarFilters from "../components/SidebarFilters";
import BookGrid from "../components/BookGrid";
import useBooks from "../hooks/useBooks";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Chat from "./Chat";
import BookCard from "../components/BookCard";
import BookSwiper from "../components/BookSwiper";
import Pagination from "../components/Pagination";
import {
  getBooksCategories,
  getTopRatedBooks,
  getFilterGenres,
  getAuthors,
} from "../api/books";
import { SwiperSlide } from "swiper/react";
import ViewAllButton from "../components/ViewAllButton";

import "swiper/css";
import "swiper/css/navigation";

function Home() {
  const navigate = useNavigate();
  const {
    books,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    totalBooks,
    loading,
  } = useBooks();

  const [chatOpen, setChatOpen] = useState(false);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  const categoryImages = {
    "Fiction": "/images/fiction.jpg",
    "Detective and mystery stories": "/images/detective.jpg",
    "American fiction": "/images/american-fiction.jpg",
    "Christian life": "/images/life.jpg",
    "Authors, English": "/images/authors.jpg",
    "Africa, East": "/images/africa.jpg",
    "Hyland, Morn (Fictitious character)": "/images/hyland.jpg",
    "Adventure stories": "/images/adventure-stories.jpg",
  };

  const services = [
    {
      title: "Read Anywhere",
      description: "Enjoy your books on any device, wherever you are.",
      icon: (
        <AutoStoriesOutlinedIcon
          sx={{ fontSize: 30 }}
        />
      ),
    },
    {
      title: "Curated Selection",
      description: "Discover highly rated titles picked from every genre.",
      icon: (
        <WorkspacePremiumOutlinedIcon
          sx={{ fontSize: 30 }}
        />
      ),
    },
    {
      title: "Fast Delivery",
      description: "Quick and reliable shipping directly to your door.",
      icon: (
        <LocalShippingOutlinedIcon
          sx={{ fontSize: 30 }}
        />
      ),
    },
    {
      title: "Audio Friendly",
      description: "Explore stories and learning in a more flexible way.",
      icon: (
        <HeadphonesOutlinedIcon
          sx={{ fontSize: 30 }}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const result = await getTopRatedBooks(20, 1);

        setTopRatedBooks(result.books);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopRated();
  }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [genresData, authorsData] = await Promise.all([
          getFilterGenres(),
          getAuthors(),
        ]);

        setGenres(
          Array.isArray(genresData)
            ? genresData
            : []
        );

        setAuthors(
          Array.isArray(authorsData)
            ? authorsData
            : []
        );
      } catch (error) {
        console.error(
          "Error loading filter options:",
          error
        );

        setGenres([]);
        setAuthors([]);
      }
    };

    loadFilterOptions();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-[#171717]">
      <section className="relative overflow-hidden bg-[#efe9df]">
        <div className="mx-auto grid min-h-[620px] max-w-[1400px] grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2">
          <div className="max-w-[650px]">
            <span className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.25em] text-[#b5202d]">
              Discover your next favorite book
            </span>

            <h1 className="font-['Playfair'] text-[56px] font-bold leading-[1.08] md:text-[72px]">
              Stories that stay
              <br />
              with you.
            </h1>

            <p className="mt-7 max-w-[560px] text-lg leading-8 text-[#66615c]">
              Explore fiction, classics, biographies, learning,
              and hidden gems selected for every kind of reader.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#b5202d] hover:cursor-pointer">
                Browse Books
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </button>

              <button className="border border-[#171717] px-7 py-4 text-sm font-semibold transition hover:bg-white hover:cursor-pointer">
                View Best Sellers
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-[430px] w-[330px]">
              <img
                src="/images/books-banner.jpg"
                alt="Books"
                className="absolute inset-0 h-full w-full rounded-[26px] object-cover shadow-2xl"
              />

              <div className="absolute -bottom-8 -left-10 w-[220px] rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Reader's Pick
                </p>
                <p className="mt-2 font-['Playfair'] text-xl font-semibold">
                  Find something worth remembering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171717] py-8 text-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex items-start gap-4"
            >
              <div className="mt-1 text-[#d94a55]">
                {service.icon}
              </div>

              <div>
                <h3 className="font-semibold">
                  {service.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-white/60">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1400px] px-6">

          <div className="mb-10 flex items-end justify-between gap-8">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
                Browse by category
              </span>

              <h2 className="mt-3 font-['Playfair'] text-[44px] font-bold leading-tight text-[#171717]">
                Find your kind of story
              </h2>

              <p className="mt-3 max-w-[520px] text-[14px] leading-6 text-[#77716b]">
                Explore stories, ideas and perspectives curated for every kind of reader.
              </p>
            </div>

            <ViewAllButton
              label="View all categories"
              to="/categories"
              className="hidden shrink-0 lg:inline-flex"
            />
          </div>

          <BookSwiper className="w-full">
            {Object.entries(categoryImages).map(([category, image]) => (
              <SwiperSlide key={category}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/books/category/${encodeURIComponent(category)}`
                    )
                  }
                  className="group/category block w-full text-left hover:cursor-pointer"
                >
                  <div className="relative h-[310px] overflow-hidden rounded-[22px] bg-[#eae5dd]">
                    <img
                      src={image}
                      alt={category}
                      className="
                        h-full w-full object-cover
                        transition-transform duration-700 ease-out
                        group-hover/category:scale-[1.045]
                      "
                    />

                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/65
                        via-black/10
                        to-transparent
                      "
                    />

                    <div
                      className="
                        absolute right-5 top-5
                        flex h-10 w-10
                        translate-y-1 items-center justify-center
                        rounded-full bg-white/90
                        text-[#171717]
                        opacity-0 backdrop-blur-sm
                        transition-all duration-300
                        group-hover/category:translate-y-0
                        group-hover/category:opacity-100
                      "
                    >
                      <ArrowForwardIcon sx={{ fontSize: 18 }} />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                        Explore
                      </span>

                      <h3 className="max-w-[90%] font-['Playfair'] text-[23px] font-semibold leading-[1.15] text-white">
                        {category}
                      </h3>
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </BookSwiper>

          <div className="mt-8 lg:hidden">
            <ViewAllButton
              label="View all categories"
              to="/categories"
            />
          </div>

        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
                Popular now
              </span>

              <h2 className="mt-3 font-['Playfair'] text-[44px] font-bold">
                Featured books
              </h2>
            </div>

            <ViewAllButton
              label="View all"
              to="/books/featured"
              className="hidden lg:inline-flex"
            />
          </div>

          <BookSwiper className="w-full">
            {topRatedBooks.map((book) => (
              <SwiperSlide key={book.id}>
                <BookCard
                  item={{
                    ...book,
                    rating: book.average_rating,
                  }}
                />
              </SwiperSlide>
            ))}
          </BookSwiper>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="relative mx-auto h-[460px] max-w-[1400px] overflow-hidden rounded-[32px]">
          <img
            src="/images/books-banner.jpg"
            alt="Explore books"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex h-full max-w-[680px] flex-col justify-center px-10 text-white md:px-16">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              Your next chapter starts here
            </span>

            <h2 className="mt-4 font-['Playfair'] text-5xl font-bold leading-tight">
              Make space for a new favorite.
            </h2>

            <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/75">
              Browse thousands of titles across fiction, learning,
              classics, and more.
            </p>

            <button className="mt-8 hover:cursor-pointer flex w-fit items-center gap-2 bg-white px-7 py-4 text-sm font-semibold text-[#171717] transition hover:bg-[#b5202d] hover:text-white">
              Shop Collection
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </section>

      <section
          id="book-catalogue"
          className="scroll-mt-24 bg-white py-24"
        >
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="mb-12">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
              Full collection
            </span>

            <h2 className="mt-3 font-['Playfair'] text-[44px] font-bold">
              Explore all books
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[270px_1fr]">
            <aside className="h-fit rounded-2xl border border-[#e8e3dc] bg-[#faf8f5] p-5">
              <SidebarFilters
                genres={genres}
                authors={authors}
                filters={filters}
                setFilters={setFilters}
              />
            </aside>

            <div>
              {loading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <p className="text-sm text-[#8b8580]">
                    Loading books...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <p className="text-sm text-[#8b8580]">
                      {totalBooks} books
                    </p>

                    <p className="text-sm text-[#8b8580]">
                      Page {page} of {totalPages}
                    </p>
                  </div>

                  <BookGrid books={books} />

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#171717] text-white shadow-xl transition hover:bg-[#b5202d] hover:cursor-pointer"
      >
        <SmsOutlinedIcon />
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <Chat onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default Home;