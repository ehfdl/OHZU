import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-second">
      <div className="flex flex-col items-center">
        <div className="flex">
          <h1 className="sm:text-[52px] text-[32px] font-semibold text-primary ">
            404 ERROR
          </h1>
          <Image
            className="sm:w-[72px] sm:h-[72px] w-11 h-11 "
            src="/image/ohzuCup.svg"
            alt="오주 잔 로고"
            width="100"
            height="100"
          />
        </div>
        <Link href="/main">
          <div className="flex justify-center items-center text-center py-3 px-3 rounded-lg duration-150 cursor-pointer hover:bg-hover hover:text-white">
            Go to main
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
