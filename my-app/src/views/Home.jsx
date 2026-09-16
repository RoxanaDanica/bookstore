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
const featuredCategories = [
  "Fiction",
  "Detective and mystery stories",
  "Adventure stories",
  "American fiction",
];
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
  const [activeCategory, setActiveCategory] = useState(featuredCategories[0]);


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
  
  const scrollToCatalogue = () => {
    document
      .getElementById("book-catalogue")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-[#171717]">
      <section className="relative overflow-hidden bg-[#efe9df]">
        <div className="absolute left-[-100px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[#b5202d]/5 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-80px] h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl" />

        <div className="relative mx-auto grid min-h-[650px] max-w-[1400px] grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-[670px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#b5202d]" />

              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b5202d]">
                Discover your next favorite book
              </span>
            </div>

            <h1 className="font-['Playfair'] text-[54px] font-bold leading-[1.03] tracking-[-0.02em] md:text-[72px] lg:text-[78px]">
              Stories worth
              <br />
              making room for.
            </h1>

            <p className="mt-7 max-w-[570px] text-[17px] leading-8 text-[#6f6963]">
              Explore fiction, classics, biographies,
              learning and hidden gems selected for
              curious minds and thoughtful readers.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToCatalogue}
                className="
                  group flex items-center gap-2
                  rounded-full bg-[#171717]
                  px-7 py-4
                  text-sm font-semibold text-white
                  transition duration-300
                  hover:bg-[#b5202d]
                  hover:cursor-pointer
                "
              >
                Browse Books

                <ArrowForwardIcon
                  sx={{
                    fontSize: 18,
                    transition: "transform 0.25s",
                  }}
                  className="group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/books/featured")
                }
                className="
                  rounded-full border border-[#cfc7bc]
                  bg-white/40 px-7 py-4
                  text-sm font-semibold text-[#171717]
                  backdrop-blur-sm
                  transition
                  hover:border-[#171717]
                  hover:bg-white
                  hover:cursor-pointer
                "
              >
                View Best Sellers
              </button>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#817b75]">
              <span>6,000+ titles</span>
              <span>Curated collections</span>
              <span>Fast delivery</span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px]">
              <div className="absolute -left-10 top-14 h-[85%] w-[85%] rounded-[34px] border border-[#cfc8bf]" />

              <div className="relative ml-auto h-[500px] w-full max-w-[390px] overflow-hidden rounded-[30px] shadow-[0_30px_80px_rgba(49,39,32,0.18)]">
                <img
                  src="/images/books-banner.jpg"
                  alt="Books"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-8 left-0 max-w-[245px] rounded-[22px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b5202d]">
                  Reader's Pick
                </p>

                <p className="mt-3 font-['Playfair'] text-[21px] font-semibold leading-snug">
                  Find something worth remembering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#171717] py-10 text-white">
        <div className="mx-auto max-w-[1400px] px-6">
          <div
            className="
              grid grid-cols-1
              overflow-hidden
              rounded-[24px]
              border border-white/10
              bg-white/[0.03]
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`
                  group relative
                  px-6 py-7
                  transition duration-300
                  hover:bg-white/[0.04]

                  ${index % 2 === 0 ? "sm:border-r sm:border-white/10" : ""}
                  ${index < 2 ? "sm:border-b sm:border-white/10" : ""}

                  ${index !== services.length - 1 ? "lg:border-r lg:border-white/10" : ""}
                  lg:border-b-0
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-[#b5202d]/15
                      text-[#d94a55]
                      transition duration-300
                      group-hover:bg-[#b5202d]
                      group-hover:text-white
                      group-hover:scale-105
                    "
                  >
                    {service.icon}
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold tracking-[0.01em] text-white">
                      {service.title}
                    </h3>

                    <p className="mt-2 max-w-[220px] text-[13px] leading-6 text-white/55">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    absolute bottom-0 left-6 right-6
                    h-px
                    origin-left scale-x-0
                    bg-[#b5202d]
                    transition-transform duration-300
                    group-hover:scale-x-100
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6f2] py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div
            className="
              mb-12 flex flex-col gap-6
              lg:flex-row lg:items-end lg:justify-between
            "
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b5202d]" />

                <span
                  className="
                    text-[10px] font-semibold
                    uppercase tracking-[0.24em]
                    text-[#b5202d]
                  "
                >
                  Browse by category
                </span>
              </div>

              <h2
                className="
                  max-w-[650px]
                  font-['Playfair']
                  text-[40px] font-bold
                  leading-[1.06]
                  tracking-[-0.025em]
                  text-[#171717]
                  md:text-[48px]
                "
              >
                Find your kind of story.
              </h2>

              <p
                className="
                  mt-4 max-w-[520px]
                  text-[15px] leading-7
                  text-[#77716b]
                "
              >
                Move through our most-loved collections and
                discover where your next read might begin.
              </p>
            </div>

            <ViewAllButton
              label="View all categories"
              to="/categories"
              className="shrink-0"
            />
          </div>
          <div
            className="
              grid items-stretch gap-8
              lg:grid-cols-[0.95fr_1.05fr]
              lg:gap-14
            "
          >
            <div
              className="
                relative
                min-h-[420px]
                overflow-hidden
                rounded-[28px]
                bg-[#e8e2da]
                md:min-h-[500px]
              "
            >
              {featuredCategories.map((category) => (
                <img
                  key={category}
                  src={categoryImages[category]}
                  alt={category}
                  className={`
                    absolute inset-0
                    h-full w-full
                    object-cover
                    transition-all duration-500 ease-out

                    ${
                      activeCategory === category
                        ? "scale-100 opacity-100"
                        : "scale-[1.03] opacity-0"
                    }
                  `}
                />
              ))}

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/25
                  via-transparent
                  to-transparent
                "
              />

              <div
                className="
                  absolute bottom-5 left-5
                  rounded-full
                  bg-white/90
                  px-4 py-2
                  backdrop-blur-md
                  md:bottom-7 md:left-7
                "
              >
                <span
                  className="
                    text-[10px] font-semibold
                    uppercase tracking-[0.16em]
                    text-[#171717]
                  "
                >
                  {activeCategory}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">

              <div className="border-t border-[#d8d1c8]">
                {featuredCategories.map((category, index) => {
                  const active = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onMouseEnter={() =>
                        setActiveCategory(category)
                      }
                      onFocus={() =>
                        setActiveCategory(category)
                      }
                      onClick={() =>
                        navigate(
                          `/books/category/${encodeURIComponent(
                            category
                          )}`
                        )
                      }
                      className="
                        group flex w-full
                        items-center gap-5
                        border-b border-[#d8d1c8]
                        py-7
                        text-left
                        transition
                        hover:cursor-pointer
                        md:py-8
                      "
                    >
                      <span
                        className={`
                          w-7 shrink-0
                          text-[10px] font-semibold
                          tracking-[0.12em]
                          transition-colors duration-300

                          ${
                            active
                              ? "text-[#b5202d]"
                              : "text-[#aaa39c]"
                          }
                        `}
                      >
                        0{index + 1}
                      </span>

                      <span
                        className={`
                          flex-1
                          font-['Playfair']
                          text-[25px] font-semibold
                          leading-tight
                          tracking-[-0.015em]
                          transition-all duration-300
                          md:text-[30px]

                          ${
                            active
                              ? "translate-x-1 text-[#171717]"
                              : "text-[#827b74]"
                          }
                        `}
                      >
                        {category}
                      </span>

                      <span
                        className={`
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-full
                          transition-all duration-300

                          ${
                            active
                              ? "bg-[#171717] text-white"
                              : "bg-transparent text-[#aaa39c]"
                          }

                          group-hover:bg-[#171717]
                          group-hover:text-white
                        `}
                      >
                        <ArrowForwardIcon
                          sx={{ fontSize: 17 }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6">

          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-[#b5202d]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b5202d]">
                  Popular now
                </span>
              </div>

              <h2 className="font-['Playfair'] text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-[#171717] md:text-[48px]">
                Books readers keep
                <br className="hidden sm:block" />
                coming back to.
              </h2>

              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#77716b]">
                Discover highly rated titles, reader favorites and standout
                books worth making room for.
              </p>
            </div>

            <ViewAllButton
              label="View all books"
              to="/books/featured"
              className="shrink-0"
            />
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-12 h-[180px] w-[180px] rounded-full bg-[#b5202d]/5 blur-3xl" />

            <div className="relative">
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
          </div>

        </div>
      </section>

      <section className="bg-[#f8f6f2] px-6 py-24">
        <div className="mx-auto max-w-[1400px]">
          <div
            className="
              relative overflow-hidden
              rounded-[30px]
              bg-[#eee8df]
              lg:min-h-[480px]
            "
          >
            <div className="grid min-h-[480px] lg:grid-cols-[0.88fr_1.12fr]">

              <div
                className="
                  relative z-10
                  flex flex-col justify-center
                  px-8 py-14
                  md:px-12
                  lg:px-16 lg:py-16
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute -left-24 -top-24
                    h-[280px] w-[280px]
                    rounded-full
                    bg-[#b5202d]/[0.06]
                    blur-3xl
                  "
                />

                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-9 bg-[#b5202d]" />

                    <span
                      className="
                        text-[10px] font-semibold
                        uppercase tracking-[0.24em]
                        text-[#b5202d]
                      "
                    >
                      Curated for curious minds
                    </span>
                  </div>

                  <h2
                    className="
                      max-w-[520px]
                      font-['Playfair']
                      text-[42px] font-bold
                      leading-[1.04]
                      tracking-[-0.025em]
                      text-[#171717]
                      md:text-[50px]
                      lg:text-[56px]
                    "
                  >
                    Your next favorite
                    <span className="text-[#b5202d]"> might be here.</span>
                  </h2>

                  <p
                    className="
                      mt-6 max-w-[470px]
                      text-[15px] leading-7
                      text-[#706a64]
                    "
                  >
                    From unforgettable fiction to ideas that stay with you,
                    explore thousands of books selected for every kind of
                    curious mind.
                  </p>

                  <button
                    type="button"
                    onClick={scrollToCatalogue}
                    className="
                      group mt-9
                      flex w-fit items-center gap-3
                      rounded-full
                      bg-[#171717]
                      px-6 py-3.5
                      text-[13px] font-semibold
                      text-white
                      transition-all duration-300
                      hover:bg-[#b5202d]
                      hover:cursor-pointer
                    "
                  >
                    Explore all books

                    <span
                      className="
                        flex h-7 w-7
                        items-center justify-center
                        rounded-full
                        bg-white/10
                        transition-transform duration-300
                        group-hover:translate-x-1
                      "
                    >
                      <ArrowForwardIcon sx={{ fontSize: 15 }} />
                    </span>
                  </button>
                </div>
              </div>

              <div
                className="
                  relative
                  min-h-[340px]
                  overflow-hidden
                  lg:min-h-[480px]
                "
              >
                <img
                  src="/images/books-banner.jpg"
                  alt="Explore our book collection"
                  className="
                    absolute inset-0
                    h-full w-full
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-[#eee8df]/60
                    via-transparent
                    to-transparent
                    lg:block
                    hidden
                  "
                />

                <div
                  className="
                    absolute bottom-6 right-6
                    rounded-[16px]
                    border border-white/30
                    bg-white/85
                    px-5 py-4
                    shadow-[0_12px_35px_rgba(0,0,0,0.10)]
                    backdrop-blur-xl
                    md:bottom-8 md:right-8
                  "
                >
                  <p
                    className="
                      text-[9px] font-semibold
                      uppercase tracking-[0.2em]
                      text-[#b5202d]
                    "
                  >
                    Ivory & Ink
                  </p>

                  <p
                    className="
                      mt-1.5
                      font-['Playfair']
                      text-[17px] font-semibold
                      text-[#171717]
                    "
                  >
                    Books for curious minds.
                  </p>
                </div>
              </div>

            </div>
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
        aria-label="Open Ivy assistant"
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