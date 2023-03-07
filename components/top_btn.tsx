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

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return (
    <>
      {showButton && (
        <div className="scroll__container fixed sm:right-[84px] sm:bottom-[150px] right-5 z-[1]">
          <button
            aria-label="top-btn"
            className="rounded-full w-16 h-16 font-light text-sm text-primary  bg-white border duration-300 border-primary hover:text-white hover:bg-hover "
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
