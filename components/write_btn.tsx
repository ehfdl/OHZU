import React from "react";
import "tailwindcss/tailwind.css";
import Image from "next/image";

const WriteButton = () => {
  return (
    <>
      <div className="scroll__container fixed right-[5%] bottom-[5%] z-50">
        <button
          className="group rounded-full sm:w-16 w-[48px] aspect-square font-thin sm:text-sm duration-300 bg-primary hover:bg-second  "
          id="write"
          type="button"
        >
          <Image
            alt=""
            src="/write/write-default.png"
            className="relative sm:ml-5 ml-[13px] cursor-pointer block group-hover:hidden"
            width={21}
            height={21}
          />
          <Image
            alt=""
            src="/write/write-pressed.png"
            className="absolute -translate-x-[11px] -translate-y-[11px] cursor-pointer hidden group-hover:inline-block"
            width={21}
            height={21}
          />
        </button>
      </div>
    </>
  );
};

export default WriteButton;
