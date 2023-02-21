import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { RiPencilFill } from "react-icons/ri";

const WriteButton = () => {
  return (
    <>
      {/* {showButton && ( */}
      <div className="scroll__container fixed right-[5%] bottom-[5%] z-50">
        <button
          className="rounded-full w-16 h-16 font-thin text-sm text-white/80 bg-black hover:text-white hover:bg-[#ff6161]/90 hover:shadow-[3px_5px_8px_#ff9999]"
          id="write"
          // onClick={scrollToTop}
          type="button"
        >
          <img
            src="/write/write-default.png"
            className="ml-5 cursor-pointer hover:fill-[#ff6161]"
          />
        </button>
      </div>
      {/* )} */}
    </>
  );
};

export default WriteButton;
