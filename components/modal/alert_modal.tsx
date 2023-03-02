import Image from "next/image";
import React, { useEffect } from "react";

export interface AlertModalProps {}

const AlertModal = ({ message }: any) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10">
        <div className="relative w-[590px] bg-white flex flex-col justify-center items-center rounded px-12 py-16">
          <h2 className="font-bold text-3xl">{message} 삭제하시겠어요?</h2>
          <p className="text-center text-textGray mt-6 mb-11">진짜로??</p>
          <div className="flex justify-between space-x-5">
            <button className="py-3 px-24 border border-primary text-primary rounded">
              취소
            </button>
            <button className="py-3 px-24 bg-primary text-white rounded">
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 웹 */}
      {/* <div className="hidden sm:block w-full h-full fixed top-0 left-0 z-10 ">
        <div className="max-w-[588px] w-full max-h-[454px] h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white rounded">
          <div className="flex flex-col justify-center items-center pt-[64px]">
            <Image
              src="/image/Check_circle.svg"
              width="72"
              height="72"
              alt="비밀번호 재설정 발송 완료"
              className="cursor-pointer mb-[22px]"
            />
            <p className="mb-8 font-bold text-[28px] ">발송 완료</p>
            <p className="mb-[30px] text-textGray">
              비밀번호 재설정 메일을 발송했습니다. <br />
              확인 후, 비밀번호를 재설정하고 로그인해주세요.
            </p>
            <button
              onClick={() => {
                // setFindPassword(false);
                // setModal(false);
                // setEmail("");
              }}
              className="w-[280px] h-[48px] bg-primary text-white font-bold rounded"
            >
              확인
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
};
export default AlertModal;
