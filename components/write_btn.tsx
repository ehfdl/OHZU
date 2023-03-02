import React from "react";
import "tailwindcss/tailwind.css";
import Image from "next/image";

const WriteButton = () => {
  return (
    <>
      <div className="scroll__container fixed right-[5%] bottom-[5%] z-50">
        <button
          className="group rounded-full w-16 aspect-square font-thin text-sm  bg-primary hover:bg-second  "
          id="write"
          type="button"
        >
          <Image
            alt=""
            src="/write/write-default.png"
            className="relative ml-5  cursor-pointer block group-hover:hidden"
            width={22}
            height={22}
          />
          <Image
            alt=""
            src="/write/write-pressed.png"
            className="absolute -translate-x-[11px] -translate-y-[10px] cursor-pointer hidden group-hover:inline-block"
            width={21}
            height={21}
          />
        </button>
      </div>
    </>
  );
};

export default WriteButton;
