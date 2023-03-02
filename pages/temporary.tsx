import Image from "next/image";
import React from "react";

const Temporary = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-second">
      <div className="flex">
        <h1 className="text-[52px] font-semibold text-primary">
          준비중입니다.
        </h1>
        <Image
          src="image/ohzuCup.svg"
          alt="오주 컵 로고"
          width="72"
          height="72"
        />
      </div>
    </div>
  );
};

export default Temporary;
