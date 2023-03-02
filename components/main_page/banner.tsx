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
import Image from "next/image";

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
    <div className="group sm:w-full sm:mt-[-62px] mt-[-50px] mb-8 py-16 flex sm:mb-10 ">
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
              <Image
                alt=""
                className="object-cover sm:w-full sm:h-full w-[390px] h-[152px]"
                src="/banner/3.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/fgIjM61aFN0ZWdCDuw0K`}>
              <Image
                alt=""
                className="object-cover sm:w-full sm:h-full w-[390px] h-[152px]"
                src="/banner/4.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/R2MLc2GBrw4jUTLGttoA`}>
              <Image
                alt=""
                className="object-cover sm:w-full sm:h-full w-[390px] h-[152px]"
                src="/banner/5.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/knxbaDkL6B2Yg0KkEnCc`}>
              <Image
                alt=""
                className="object-cover sm:w-full sm:h-full w-[390px] h-[152px]"
                src="/banner/6.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={`/post/avQb8boBf67BFM0eIEqz`}>
              <Image
                alt=""
                className="object-cover sm:w-full sm:h-full w-[390px] h-[152px]"
                src="/banner/7.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
        </div>
        <div className="w-full">
          <button
            ref={bannerPrevRef}
            className="p-2 absolute hidden group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] bg-black/20 text-white cursor-pointer sm:left-10 left-2 z-20 -translate-y-[16px] top-1/2 sm:-translate-y-1/2 rounded-full"
          >
            <BsChevronLeft
              size={20}
              className="relative right-[4px] bottom-[2px] sm:left-[1px] sm:bottom-[0px]"
            />
          </button>
        </div>
        <div className="">
          <button
            ref={bannerNextRef}
            className="p-2 absolute hidden group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] bg-black/20 text-white cursor-pointer sm:right-10 right-2 z-20 top-1/2 -translate-y-[15px] sm:-translate-y-1/2 rounded-full"
          >
            <BsChevronRight
              size={20}
              className="relative right-[1px] bottom-[2px] sm:left-[3px] sm:bottom-[0px]"
            />
          </button>
        </div>
      </Swiper>
    </div>
  );
};
export default MainBanner;
