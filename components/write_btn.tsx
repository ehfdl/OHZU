import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { RiPencilFill } from "react-icons/ri";

const WriteButton = () => {
  return (
    <>
      {/* {showButton && ( */}
      <div className="scroll__container fixed right-[5%] bottom-[5%] z-50">
        <button
          className="group rounded-full w-16 h-16 font-thin text-sm  bg-[#ff6161]/90 hover:bg-[#FFF0F0]  "
          id="write"
          // onClick={scrollToTop}
          type="button"
        >
          <img
            src="/write/write-default.png"
            className="relative ml-5 cursor-pointer block group-hover:hidden"
          />
          <img
            src="/write/write-pressed.png"
            className="absolute -translate-x-3 -translate-y-3 cursor-pointer hidden group-hover:inline-block"
          />
        </button>
      </div>
      {/* )} */}
    </>
  );
};

export default WriteButton;
