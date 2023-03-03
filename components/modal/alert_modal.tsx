import useModal from "@/hooks/useModal";
import Image from "next/image";
import React, { useEffect } from "react";

export interface AlertModalProps {}

const AlertModal = ({ src, title, text, btntext, btnfunc }: any) => {
  const { hideModal } = useModal();

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  return (
    <>
      <div className="w-screen h-full bg-black/50 fixed top-0 left-0 z-10">
        <div
          className="max-w-[344px] w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white rounded
        sm:max-w-[588px] sm:w-full         "
        >
          <div className="flex flex-col justify-center items-center pt-[30px] sm:pt-[64px]">
            {src && (
              <Image
                src={src}
                width="40"
                height="40"
                alt="확인 로고"
                className="mb-5 sm:mb-[22px]"
              />
            )}
            <p className="font-bold text-lg mb-6 sm:text-[28px] sm:mb-8">
              {title}
            </p>
            <pre className="mb-[30px] text-sm text-center text-textGray sm:text-base sm:mb-[62px]">
              {text}
            </pre>
            <button
              onClick={() => {
                btnfunc ? btnfunc() : hideModal();
              }}
              className="w-full h-[56px] bg-primary text-white text-lg font-bold rounded sm:w-[280px] sm:h-[48px] cursor-pointer sm:mb-[72px]"
            >
              {btntext ? btntext : "확인"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AlertModal;
