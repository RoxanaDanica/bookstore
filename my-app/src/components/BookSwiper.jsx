import { Swiper, SwiperSlide } from "swiper/react";
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
  return (
    <div className="group relative">

      <button
        className=" swiper-prev absolute left-[-50px] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <ArrowBackOutlinedIcon className="text-black" />
      </button>

      <button
        className="swiper-next absolute right-[-50px] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <ArrowForwardOutlinedIcon className="text-black" />
      </button>
      <Swiper
        modules={[Navigation]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        loop
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        className={className}
      >
        {children}
      </Swiper>

    </div>
  );
}