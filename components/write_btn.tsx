import React from "react";
import "tailwindcss/tailwind.css";
import Image from "next/image";

const WriteButton = () => {
  return (
    <div className="scroll__container flex justify-center items-center fixed sm:right-[84px] right-8 bottom-10 z-[1] group rounded-full sm:w-16 w-[48px] aspect-square font-thin sm:text-sm duration-300 bg-primary hover:bg-second cursor-pointer">
      <Image
        alt=""
        src="/write/write-default.png"
        className="w-[21px] h-auto aspect-square cursor-pointer block group-hover:hidden"
        width={21}
        height={21}
      />
      <Image
        alt=""
        src="/write/write-pressed.png"
        className="w-[21px] h-auto aspect-square cursor-pointer hidden group-hover:inline-block"
        width={21}
        height={21}
      />
    </div>
  );
};

export default WriteButton;
