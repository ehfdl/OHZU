import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

const TopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    console.log(window.scrollY);
    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return (
    <>
      {showButton && (
        <div className="scroll__container fixed right-[5%] bottom-[13%] z-0">
          <button
            className="rounded-full w-16 h-16 font-thin text-sm text-white/80 bg-black hover:text-white hover:font-normal hover:drop-shadow-xl"
            id="top"
            onClick={scrollToTop}
            type="button"
          >
            Top
          </button>
        </div>
      )}
    </>
  );
};

export default TopButton;
