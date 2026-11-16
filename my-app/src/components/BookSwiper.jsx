
import { useRef } from "react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import "swiper/css";
import "swiper/css/navigation";

export default function BookSwiper({
  children,
  slidesPerView = 5,
  spaceBetween = 20,
  className = "",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="group relative min-w-0 w-full">
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous books"
        className="
          absolute left-2 top-1/2 z-10
          flex h-10 w-10 -translate-y-1/2
          items-center justify-center
          rounded-full bg-white shadow-md
          opacity-100 transition-all duration-300
          hover:bg-[#b5202d] hover:text-white
          cursor-pointer
          sm:left-3
          lg:-left-5 lg:h-12 lg:w-12
          lg:opacity-0 lg:group-hover:opacity-100
        "
      >
        <ArrowBackOutlinedIcon fontSize="small" />
      </button>

      <button
        ref={nextRef}
        type="button"
        aria-label="Next books"
        className="
          absolute right-2 top-1/2 z-10
          flex h-10 w-10 -translate-y-1/2
          items-center justify-center
          rounded-full bg-white shadow-md
          opacity-100 transition-all duration-300
          hover:bg-[#b5202d] hover:text-white
          cursor-pointer
          sm:right-3
          lg:-right-5 lg:h-12 lg:w-12
          lg:opacity-0 lg:group-hover:opacity-100
        "
      >
        <ArrowForwardOutlinedIcon fontSize="small" />
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={1.2}
        spaceBetween={12}
        breakpoints={{
          480: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: spaceBetween,
          },
          1280: {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween,
          },
        }}
        loop={true}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className={`w-full min-w-0 ${className}`}
      >
        {children}
      </Swiper>
    </div>
  );
}
