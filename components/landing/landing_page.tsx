import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../animation/landing_page.json";

const LandingPage = () => {
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center relative">
        <Image
          className="w-screen h-screen absolute top-0 left-0"
          src="/image/landing_background.jpg"
          alt="렌딩페이지 배경화면"
          width="200"
          height="200"
        />
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-1/3 sm:w-1/2 "
        />
        <div className="absolute bottom-[17%] left-1/2 transform -translate-x-1/2 z-50">
          <p className="sm:mb-5 mb-3 sm:text-base text-[10px] text-center font-semibold text-[#fff] ">
            나만의 혼합주를 사람들과 공유해보세요!
          </p>
          <div className="flex justify-center items-center sm:w-[280px] w-[160px] sm:h-[71px] h-10 m-auto text-sm sm:text-[36px]  text-white border-[1px] rounded-[50px] cursor-pointer duration-300  hover:bg-white/30 ">
            <Link href="/main" aria-label="enter_btn">
              입장하기
            </Link>
            <Image
              className="sm:w-8 sm:h-8 w-4 h-4 sm:ml-[18px] ml-2 "
              src="/image/underArrow.svg"
              alt="입장하기 화살표"
              width="200"
              height="200"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
