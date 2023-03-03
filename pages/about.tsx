import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="w-screen">
      <div className="w-full max-h-[500px] h-full mb-[92px]">
        <Image
          alt="OHZU 배경사진"
          src="/image/aboutBg.png"
          className="w-full min-h-[480px] h-full  bg-cover"
          width={100}
          height={100}
        />
      </div>
      <div className="flex justify-between max-w-[1156px] w-full m-auto">
        <Image
          alt="OHZU Logo"
          src="/LOGO.svg"
          className="max-w-[234px] w-full max-h-[60px] h-full"
          width={100}
          height={100}
        />
        <div>
          <p className="mt-2 mb-[22px] font-semibold text-[24px]">
            "오늘의 혼합주"
          </p>
          <p>
            OHZU는 나 혼자 알기 아쉬운 혼합주를 공유하고, 애주가들이 즐겨마시는
            혼합주 레시피를 볼 수 있는 공간입니다.
          </p>
          <div className="flex">
            <p className="flex items-center">
              취향에 맞는 다양하고 맛있는 술을 직접 만들어서 마시는 즐거움을 두
              배로!{" "}
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
