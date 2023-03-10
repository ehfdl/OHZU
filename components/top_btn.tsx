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
        <div className="scroll__container fixed sm:right-[84px] sm:bottom-[128px] right-5 z-[1]">
          <button
            aria-label="top-btn"
            className="rounded-full w-16 h-16  text-sm text-white bg-hover border-[2px] duration-200 border-hover hover:bg-second hover:text-hover hover:border-second hover:drop-shadow-[4px_5px_3px_rgba(0,0,0,0.25)]"
            id="top"
            onClick={scrollToTop}
            type="button"
          >
            TOP
          </button>
        </div>
      )}
    </>
  );
};

export default TopButton;
