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
    <div className="group w-full mb-4 flex sm:mb-10">
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
            <Link
              aria-label="banner-1"
              href={{
                pathname: `/post/블루베리_라임_소주`,
                query: {
                  postId: "7aHaIn5nNLSMwLV4nKyC",
                },
              }}
              as={`/post/블루베리_라임_소주`}
            >
              <Image
                alt="main_banner_image"
                className="object-cover w-full min-h-[180px]"
                src="/banner/3.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link
              aria-label="banner-2"
              href={{
                pathname: `/post/크렌베리_오렌지_소주`,
                query: {
                  postId: "HAX99HwmDDUETpxiprFo",
                },
              }}
              as={`/post/크렌베리_오렌지_소주`}
            >
              <Image
                alt="main_banner_image"
                className="object-cover w-full min-h-[180px]"
                src="/banner/4.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link
              aria-label="banner-3"
              href={{
                pathname: `/post/라임_JELL-O_맥주`,
                query: {
                  postId: "w1Y390uY9l7zGUNGSjDI",
                },
              }}
              as={`/post/라임_JELL-O_맥주`}
            >
              <Image
                alt="main_banner_image"
                className="object-cover w-full min-h-[180px]"
                src="/banner/5.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide className="overflow-hidden ">
            <Link
              aria-label="banner-4"
              href={{
                pathname: `/post/무화과_칵테일`,
                query: {
                  postId: "Avg5qd9KUPx1ugWnCHzL",
                },
              }}
              as={`/post/무화과_칵테일`}
            >
              <Image
                alt="main_banner_image"
                className="object-cover w-full min-h-[180px]"
                src="/banner/6.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link
              aria-label="banner-5"
              href={{
                pathname: `/post/아이리쉬_크림_칵테일`,
                query: {
                  postId: "a9ZwgOaQoR3tAj0r3ZyX",
                },
              }}
              as={`/post/아이리쉬_크림_칵테일`}
            >
              <Image
                alt="main_banner_image"
                className="object-cover w-full min-h-[180px]"
                src="/banner/7.svg"
                width={300}
                height={300}
                priority
              ></Image>
            </Link>
          </SwiperSlide>
        </div>
        <style jsx global>{`
          .swiper-pagination .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.7);
            opacity: 1;
            width: 10px;
            height: 10px;
            margin: 0 5px !important;
          }
          .swiper-pagination .swiper-pagination-bullet-active {
            background: #ff6161;
            width: 50px;
            border-radius: 100px;
          }
          @media screen and (max-width: 520px) {
            .swiper-pagination {
              bottom: 0px !important;
            }
            .swiper-pagination .swiper-pagination-bullet {
              width: 6px;
              height: 6px;
              margin: 0 3px !important;
            }
            .swiper-pagination .swiper-pagination-bullet-active {
              width: 30px;
            }
          }
        `}</style>
      </Swiper>
    </div>
  );
};
export default MainBanner;
