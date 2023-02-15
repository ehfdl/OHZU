import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { RiPencilFill } from "react-icons/ri";

const WriteButton = () => {
  //   const [showButton, setShowButton] = useState(false);

  //   const scrollToTop = () => {
  //     window.scroll({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   };
  //   useEffect(() => {
  //     const handleShowButton = () => {
  //       if (window.scrollY > 500) {
  //         setShowButton(true);
  //       } else {
  //         setShowButton(false);
  //       }
  //     };

  //     console.log(window.scrollY);
  //     window.addEventListener("scroll", handleShowButton);
  //     return () => {
  //       window.removeEventListener("scroll", handleShowButton);
  //     };
  //   }, []);

  return (
    <>
      {/* {showButton && ( */}
      <div className="scroll__container fixed right-[5%] bottom-[5%] z-0">
        <button
          className="rounded-full w-16 h-16 font-thin text-sm text-white/80 bg-black hover:text-white hover:drop-shadow-xl"
          id="write"
          // onClick={scrollToTop}
          type="button"
        >
          <RiPencilFill size={25} className="ml-5 cursor-pointer" />
        </button>
      </div>
      {/* )} */}
    </>
  );
};

export default WriteButton;
