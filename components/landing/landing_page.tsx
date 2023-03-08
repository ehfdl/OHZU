import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../animation/landing_page.json";

const LandingPage = () => {
  return (
    <>
      <div className="w-screen h-screen bg-landing_bg bg-cover flex flex-col items-center justify-center">
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="sm:mb-[150px] mb-12 w-[70%]  sm:w-auto"
        />
        <div className="z-50">
          <p className="sm:mb-5 mb-3 sm:text-base text-xs text-center font-semibold text-[#fff] ">
            나만의 혼합주를 사람들과 공유해보세요!
          </p>
          <Link href="/main" aria-label="enter_btn">
            <div className="flex justify-center items-center sm:w-[280px] w-[160px] sm:h-[71px] h-10 m-auto text-sm sm:text-[36px]  text-white border-[1px] rounded-[50px] cursor-pointer duration-300  hover:bg-white/30 ">
              입장하기
              <Image
                className="sm:w-8 sm:h-8 w-4 h-4 sm:ml-[18px] ml-2 "
                src="/image/underArrow.svg"
                alt="입장하기 화살표"
                width="200"
                height="200"
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
