import { authService, dbService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState, useRef, ReactElement } from "react";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react"; // basic
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  EffectCoverflow,
  Mousewheel,
  Autoplay,
} from "swiper";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  SwiperModule,
  SwiperOptions,
  NavigationEvents,
  NavigationMethods,
  NavigationOptions,
  SwiperEvents,
} from "swiper/types";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const MainBanner = () => {
  SwiperCore.use([
    EffectCoverflow,
    Navigation,
    Mousewheel,
    Scrollbar,
    Pagination,
    Autoplay,
  ]);

  const swiper = useSwiper();

  const navigationNextRef = useRef(null);
  const navigationPrevRef = useRef(null);

  return (
    <div className="group h-[500px] w-full mt-[-40px] py-16 flex mb-10 ">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Navigation, Mousewheel, Autoplay]}
        grabCursor={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        <div className="group w-screen">
          <SwiperSlide>
            <img className="object-cover w-full" src="/banner/3.svg"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img className="object-cover w-full" src="/banner/4.svg"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img className="object-cover w-full" src="/banner/5.svg"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img className="object-cover w-full" src="/banner/6.svg"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img className="object-cover w-full" src="/banner/7.svg"></img>
          </SwiperSlide>
        </div>
        <div className="w-full">
          <button
            ref={navigationPrevRef}
            className="p-2 absolute hidden group-hover:block hover:text-[#FF6161] hover:bg-[#FFF0F0]/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer left-10 z-20 top-1/2 -translate-y-1/2 rounded-full"
          >
            <BsChevronLeft size={25} />
          </button>
        </div>
        <div className="">
          <button
            ref={navigationNextRef}
            className="p-2 absolute hidden group-hover:block hover:text-[#FF6161] hover:bg-[#FFF0F0]/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer right-10 z-20 top-1/2 -translate-y-1/2 rounded-full"
          >
            <BsChevronRight size={25} />
          </button>
        </div>
      </Swiper>
    </div>
  );
};
export default MainBanner;
