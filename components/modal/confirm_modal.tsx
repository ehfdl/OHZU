import useModal from "@/hooks/useModal";
import React, { useEffect } from "react";

export interface ConfirmModalProps {}

const ConfirmModal = ({
  title,
  text,
  leftbtntext,
  rightbtntext,
  leftbtnfunc,
  rightbtnfunc,
}: any) => {
  const { hideModal } = useModal();
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10">
      <div className="relative w-[590px] bg-white flex flex-col justify-center items-center rounded px-12 py-16">
        <h2 className="font-bold text-3xl">{title}</h2>
        <p className="text-center text-textGray mt-6 mb-11">{text}</p>
        <div className="flex justify-between space-x-5">
          <button
            className="py-3 px-24 border border-primary text-primary rounded"
            onClick={leftbtnfunc ? leftbtnfunc : hideModal}
          >
            {leftbtntext ? leftbtntext : "취소"}
          </button>
          <button
            className="py-3 px-24 bg-primary text-white rounded"
            onClick={rightbtnfunc}
          >
            {rightbtntext ? rightbtntext : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
