import { useState, useEffect } from "react";
import SidebarFilters from "../components/SidebarFilters";
import BookGrid from "../components/BookGrid";
import useBooks from "../components/useBooks";
import useInfiniteScroll from "../components/useInfiniteScroll";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import Chat from "./Chat";
import BookCard from "../components/BookCard";
import BookSwiper from "../components/BookSwiper";
import { getBooksCategories, getTopRatedBooks } from '../api/books';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

function Home() {
  const {
    books,
    setBooks,
    loadBooks,
    hasMore,
    filters,
    setFilters,
    searchTerm,
  } = useBooks();
  const [bookCategories, setBookCategories] = useState([]);
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
      title: "Multi-Device Reading",
      description: "Pellentesque varius accumsan temp nullam placerat aliquet purus.",
      icon: <AutoStoriesIcon className="text-[#e52334]" sx={{ fontSize: 50 }} />
    },
    {
      title: "Award Winning Content",
      description: "Pellentesque varius accumsan temp nullam placerat aliquet purus.",
      icon: <WorkspacePremiumIcon className="text-[#e52334]" sx={{ fontSize: 50 }} />
    },
    {
      title: "Crystal Clear Resolution",
      description: "Pellentesque varius accumsan temp nullam placerat aliquet purus.",
      icon: <StorefrontIcon className="text-[#e52334]" sx={{ fontSize: 50 }} />
    },
    {
      title: "Audio Learning Experience",
      description: "Pellentesque varius accumsan temp nullam placerat aliquet purus.",
      icon: <PlayLessonIcon className="text-[#e52334] " sx={{ fontSize: 50 }} />
    }
  ];
    
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getBooksCategories();
        console.log("Categories response:", categories);
        setBookCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const books = await getTopRatedBooks();
      setBooks(books);
    } catch(error) {
      console.error(error);
    }
  };

  fetchBooks();
}, []);

  const [chatOpen, setChatOpen] = useState(false);

  useInfiniteScroll(loadBooks, hasMore);

  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-[linear-gradient(90deg,#ebeae4_0%,#e9e9e9_100%)] w-full">
        <div className="flex flex-col items-center justify-center py-10 font-['playfair']  text-[50px] font-bold">
          <h2>Stay In Touch With Our Updates Deciding </h2>
          <h2>
            What To{" "}
            <span className="text-[#e52334]">
              <span className="inline-block after:content-[''] after:block after:w-[70px] after:h-[2px] after:bg-[#e52334] after:mt-2">
                Read
              </span>{" "}
              Next?
            </span>
          </h2>
        </div>
        <section className="px-[300px]">
          <BookSwiper className="w-[1510px] my-5">
            {bookCategories.map((category,index)=>(
              <SwiperSlide key={index}>
                <div className="w-[286px]">
                  <img
                    src={categoryImages[category.categories]}
                    className="h-[286px] w-full object-cover transition-all duration-[250ms] ease-[ease] hover:-translate-y-2"/>
                    <p className="mt-4 text-center font-['Playfair'] text-xl font-bold">{category.categories}</p>
                </div>
              </SwiperSlide>
            ))}
          </BookSwiper>
        </section>
      </div>

      <section className="py-[120px] bg-[#f5f4f0] w-full">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-[80px] px-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`
                group
                relative flex flex-col items-center text-center
                transition-all duration-200
                ${index !== services.length - 1
                  ? "after:content-[''] after:absolute after:top-0 after:right-[-40px] after:h-[157px] after:w-px after:bg-[#e5e5e5]"
                  : ""}
              `}
            >
              <div className="text-[#e52334] text-[50px] mb-5 transition-all duration-[250ms] ease-[ease] group-hover:-translate-y-2">
                {service.icon}
              </div>

              <h3 className="font-['playfair'] text-2xl font-[600]">
                {service.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    
      <section className="bg-white py-[100px]">
      <div className="mx-auto max-w-[5410px] px-[300px]">
        <h2 className="mb-12 text-center font-['Playfair'] text-[50px] font-bold">Featured Products</h2>
        <BookSwiper className="w-[1510px]">
          {books.map(book => (
            <SwiperSlide key={book.id}>
              <BookCard
                item={{
                  ...book,
                  rating: book.average_rating
                }}
              />
            </SwiperSlide>
          ))}
        </BookSwiper>
      </div>
      </section>

      <section className="relative h-[720px] w-full">
        <img
          src="/images/books-banner.jpg"
          alt="Explore books"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h2 className="font-['Playfair'] text-5xl font-bold md:text-6xl">Explore A World of Books</h2>
          <p className="mt-5 max-w-xl text-lg text-white/90">Discover stories, knowledge, and adventures waiting for you.</p>
          <button className="mt-8 bg-[#e52334] px-10 py-4 text-lg font-semibold uppercase transition-all duration-300 hover:bg-white hover:text-[#e52334]">
            Shop Now
          </button>
        </div>
      </section>

      {/* <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", width: "1400px" }}>
        <SidebarFilters
          books={books}
          filters={filters}
          setFilters={setFilters}
        />

        <BookGrid books={books} />
      </div> */}

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#e52334] text-white text-2xl shadow-lg flex items-center justify-center hover:cursor-pointer"
      >
        <SmsOutlinedIcon />
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white shadow-2xl rounded-xl border border-[#e5e5e5] z-50">
          <div className="flex justify-between items-center p-2 border-b border-[#e5e5e5]">
            <span className="font-bold">Chat</span>
            <button className="hover:cursor-pointer" onClick={() => setChatOpen(false)}><ClearOutlinedIcon /></button>
          </div>
          <Chat />
        </div>
      )}
    </div>
  );
}

export default Home;