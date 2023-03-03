import Image from "next/image";
import React from "react";

const Temporary = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-second">
      <div className="flex items-center">
        <h1 className="sm:text-[52px] text-[32px] font-semibold text-primary ">
          준비중입니다.
        </h1>
        <Image
          className="sm:w-[72px] sm:h-[72px] w-11 h-11"
          src="image/ohzuCup.svg"
          alt="오주 잔 로고"
          width="100"
          height="100"
        />
      </div>
    </div>
  );
};

export default Temporary;
