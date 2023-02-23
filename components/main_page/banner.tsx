import React, { useRef } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"; // basic
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

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Link from "next/link";

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

  const bannerNextRef = useRef(null);
  const bannerPrevRef = useRef(null);

  return (
    <div className="group w-full mt-[-62px] py-16 flex mb-10 ">
      <Swiper
        observer={true}
        observeParents={true}
        spaceBetween={24}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        navigation={{
          prevEl: bannerPrevRef.current,
          nextEl: bannerNextRef.current,
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
            <Link href={`/post/0lwyBZaw7I1IxihpDMuS`}>
              <img className="object-cover w-full" src="/banner/3.svg"></img>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/fgIjM61aFN0ZWdCDuw0K`}>
              <img className="object-cover w-full" src="/banner/4.svg"></img>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/R2MLc2GBrw4jUTLGttoA`}>
              <img className="object-cover w-full" src="/banner/5.svg"></img>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/knxbaDkL6B2Yg0KkEnCc`}>
              <img className="object-cover w-full" src="/banner/6.svg"></img>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/avQb8boBf67BFM0eIEqz`}>
              <img className="object-cover w-full" src="/banner/7.svg"></img>
            </Link>
          </SwiperSlide>
        </div>
        <div className="w-full">
          <button
            ref={bannerPrevRef}
            className="p-2 absolute hidden group-hover:block hover:text-[#FF6161] hover:bg-[#FFF0F0]/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer left-10 z-20 top-1/2 -translate-y-1/2 rounded-full"
          >
            <BsChevronLeft
              size={25}
              className="relative right-[2px] bottom-[1px]"
            />
          </button>
        </div>
        <div className="">
          <button
            ref={bannerNextRef}
            className="p-2 absolute hidden group-hover:block hover:text-[#FF6161] hover:bg-[#FFF0F0]/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer right-10 z-20 top-1/2 -translate-y-1/2 rounded-full"
          >
            <BsChevronRight
              size={25}
              className="relative left-[1px] bottom-[1px]"
            />
          </button>
        </div>
      </Swiper>
    </div>
  );
};
export default MainBanner;
