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
    <div className="w-screen h-full bg-black/50 fixed top-0 left-0 z-10">
      <div className="max-w-[344px] w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white ">
        <div className="flex flex-col justify-center items-center pt-[30px]">
          {src && (
            <Image
              src={src}
              width="40"
              height="40"
              alt="비밀번호 재설정 발송 완료"
              className="cursor-pointer mb-5"
            />
          )}
          <p className="font-bold text-lg mb-6">{title}</p>
          <pre className="mb-[30px] text-sm text-center text-textGray">
            {text}
          </pre>
          <button
            onClick={() => {
              btnfunc ? btnfunc() : hideModal();
            }}
            className="w-full h-[56px] bg-primary text-white text-lg font-bold"
          >
            {btntext ? btntext : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AlertModal;