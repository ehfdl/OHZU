import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="w-screen">
      <div className="w-full max-h-[400px] h-full ">
        <Image
          alt="OHZU 배경사진"
          src="/image/aboutBg.png"
          className="w-full h-full bg-cover"
          width={100}
          height={100}
        />
      </div>
      <div className="flex max-w-[1156px] w-full m-auto bg-red-300">
        <Image
          alt="OHZU Logo"
          src="/LOGO.svg"
          className="max-w-[234px] w-full max-h-[60px] h-full"
          width={100}
          height={100}
        />
        <div>
          <p>"오늘의 혼합주"</p>
          <div className="flex">
            <p>
              OHZU는 나 혼자 알기 아쉬운 혼합주를 공유하고, 애주가들이
              즐겨마시는 혼합주 레시피를 볼 수 있는 공간입니다. <br />
              취향에 맞는 다양하고 맛있는 술을 직접 만들어서 마시는 즐거움을 두
              배로!{" "}
            </p>
            <Image
              alt="OHZU 술잔 로고"
              src="/image/ohzuCup.svg"
              className="w-[64px] h-[64px]"
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
