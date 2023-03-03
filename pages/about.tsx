import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="w-screen">
      <div className="w-full h-screen">
        <Image
          alt="OHZU 배경사진"
          src="/image/aboutBg.png"
          className="w-full h-1/2 bg-cover"
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col flex-wrap sm:justify-between max-w-[1156px] w-full m-auto sm:flex-row sm:items-center">
        <Image
          alt="OHZU Logo"
          src="/LOGO.svg"
          className="sm:max-w-[234px] max-w-[180px] w-full max-h-[60px] h-full mb-5 m-auto sm:m-0"
          width={100}
          height={100}
        />
        <div className="text-center sm:text-left">
          <p className="mt-2 mb-[22px] font-semibold sm:text-[24px] text-lg">
            "오늘의 혼합주"
          </p>
          {/* 웹 */}
          <p className="hidden sm:block">
            OHZU는 나 혼자 알기 아쉬운 혼합주를 공유하고, 애주가들이 즐겨마시는
            혼합주 레시피를 볼 수 있는 공간입니다.
          </p>
          {/* 모바일 */}
          <p className="sm:hidden text-sm mb-4">
            OHZU는 나 혼자 알기 아쉬운 혼합주를 공유하고,
            <br /> 애주가들이 즐겨마시는 혼합주 레시피를 볼 수 있는 공간입니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start">
            {/* 웹 */}
            <p className="hidden sm:block">
              취향에 맞는 다양하고 맛있는 술을 직접 만들어서 마시는 즐거움을 두
              배로!
            </p>
            {/* 모바일 */}
            <p className="sm:hidden text-sm sm:text-base">
              취향에 맞는 다양하고 맛있는 술을 직접 만들어서
              <br /> 마시는 즐거움을 두 배로!
            </p>
            <Image
              alt="OHZU 술잔 로고"
              src="/image/ohzuCup.svg"
              className="w-[40px] h-[40px] inline rotate-12"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
