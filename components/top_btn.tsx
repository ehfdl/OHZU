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
        <div className="scroll__container fixed right-[5%] bottom-[14%] z-0">
          <button
            className="rounded-full w-16 h-16 font-thin text-sm text-black/80 bg-white border border-black/50 hover:text-[#ff6161] hover:border-[#ff9999]/50 hover:shadow-[3px_5px_8px_#ff9999]"
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
