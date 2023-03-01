import React, { useEffect } from "react";

export interface AlertModalProps {}

const AlertModal = ({ message }: any) => {
  return (
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
  );
};
export default AlertModal;
