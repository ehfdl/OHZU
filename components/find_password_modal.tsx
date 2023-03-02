import Image from "next/image";
import React from "react";

const FindPasswordModal = ({ setFindPassword, setModal, setEmail }: any) => {
  return (
    <>
      {/* 웹 */}
      <div className="hidden sm:block w-full h-full fixed top-0 left-0 z-10 ">
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
                setFindPassword(false);
                setModal(false);
                setEmail("");
              }}
              className="w-[280px] h-[48px] bg-primary text-white font-bold rounded"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="sm:hidden w-screen h-full bg-black/50 fixed top-0 left-0 z-10">
        <div className="max-w-[344px] w-full max-h-[267px] h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white ">
          <div className="flex flex-col justify-center items-center pt-[30px]">
            <Image
              src="/image/Check_circle.svg"
              width="40"
              height="40"
              alt="비밀번호 재설정 발송 완료"
              className="cursor-pointer mb-5"
            />
            <p className="font-bold text-lg mb-6">발송 완료</p>
            <p className="mb-[30px] text-sm text-textGray">
              메일을 발송했습니다. <br />
              해당 메일에서 비밀번호를 재설정하고 로그인해주세요.
            </p>
            <button
              onClick={() => {
                setFindPassword(false);
                setModal(false);
                setEmail("");
              }}
              className="w-full h-[56px] bg-primary text-white text-lg font-bold"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindPasswordModal;
