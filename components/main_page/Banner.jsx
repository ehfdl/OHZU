import React, { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

function Banner() {
  const slides = [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Cocktail_02.jpg",
    },
    {
      url: "https://img.delicious.com.au/CKMUcpx-/w1200/del/2015/11/summer-cocktails-24374-3.jpg",
    },
    {
      url: "https://img.taste.com.au/v31qR-vt/taste/2021/12/choc-mint-mudslide-cocktail-175833-2.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <form>
      <div className="relative">
        <p className="font-bold text-3xl">⭐️ 오주가 추천하는 레시피</p>
        <div className="max-w-[1920px] h-[400px] w-full mt-[-40px] py-16 relative group">
          <div
            style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
            className="w-full h-full bg-center bg-cover duration-500"
          >
            <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-16 left-1/2">
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-5xl cursor-pointer text-gray-200/60 hover:text-white focus:text-white "
                >
                  <RxDotFilled />
                </div>
              ))}
            </div>
          </div>
          {/* Left arrow */}
          <div className="hidden group-hover:block hover:text-white hover:bg-white/40 absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronLeft onClick={prevSlide} size={20} />
          </div>

          {/* Right arrow */}
          <div className="hidden group-hover:block hover:text-white hover:bg-white/40 absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronRight onClick={nextSlide} size={20} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default Banner;
