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
      {/* 웹 */}
      {/* <div className="hidden sm:block w-full h-full fixed top-0 left-0 z-10 ">
        <div className="sm:max-w-[588px] sm:w-full sm:max-h-[454px] sm:h-full sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2  bg-white rounded">
          <div className="flex flex-col justify-center items-center sm:pt-[64px]">
            <Image
              src="/image/Check_circle.svg"
              width="72"
              height="72"
              alt="비밀번호 재설정 발송 완료"
              className="cursor-pointer sm:mb-[22px]"
            />
            <p className="sm:mb-8 font-bold sm:text-[28px] ">발송 완료</p>
            <p className="mb-[30px] text-textGray">
              비밀번호 재설정 메일을 발송했습니다. <br />
              확인 후, 비밀번호를 재설정하고 로그인해주세요.
            </p>
            <button
              onClick={() => {
                setFindPassword(false);
                setModal(false);
                setEmail("");
              }}
              className="sm:w-[280px] sm:h-[48px] bg-primary text-white font-bold rounded"
            >
              확인
            </button>
          </div>
        </div>
      </div> */}

      {/* 모바일 */}
      <div className="w-screen h-full bg-black/50 fixed top-0 left-0 z-10">
        <div
          className="max-w-[344px] w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white rounded
        sm:max-w-[588px] sm:w-full sm:max-h-[454px] sm:h-full
        "
        >
          <div className="flex flex-col justify-center items-center pt-[30px] sm:pt-[64px]">
            {src && (
              <Image
                src={src}
                width="40"
                height="40"
                alt="비밀번호 재설정 발송 완료"
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
              className="w-full h-[56px] bg-primary text-white text-lg font-bold rounded sm:w-[280px] sm:h-[48px] cursor-pointer"
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
