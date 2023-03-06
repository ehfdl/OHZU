import Image from "next/image";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../animation/landing_page.json";

const LandingPage = () => {
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center items-center relative">
        <Image
          className="w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen bg-green-700"
          src="/image/landing_background.jpg"
          alt="렌딩페이지 배경화면"
          width="200"
          height="200"
        />
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen"
          // className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[440px] h-[150px]"
        />
        <div className="z-50 sm:mt-14 mt-10">
          <h1 className=" mb-[52px] sm:mb-[300px] text-center font-semibold text-sm sm:text-[28px] text-white  ">
            오늘의 혼합주
          </h1>
          <div className="flex justify-center items-center sm:w-[280px] w-[160px] sm:h-[71px] h-10 sm:mt-16 mt-[70px] m-auto text-sm sm:text-[36px]  text-white border-[1px] rounded-[50px] cursor-pointer duration-300  hover:bg-white/20">
            <p>입장하기</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
