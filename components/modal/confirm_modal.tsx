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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10">
      <div className="relative w-[350px] sm:w-[588px] bg-white flex flex-col justify-center items-center rounded pt-8 sm:px-12 sm:py-16">
        <h2 className="font-bold sm:text-3xl">{title}</h2>
        <p className="text-center text-sm sm:text-base text-textGray mt-4 sm:mt-6 mb-9 sm:mb-11">
          {text}
        </p>
        <div className="flex w-full justify-center sm:gap-4">
          <button
            aria-label="cancel"
            className="py-3 w-1/2 sm:w-[236px] border-t border-r sm:border border-primary text-primary rounded-bl sm:rounded"
            onClick={leftbtnfunc ? leftbtnfunc : hideModal}
          >
            {leftbtntext ? leftbtntext : "취소"}
          </button>
          <button
            aria-label="confirm"
            className="py-3 w-1/2 sm:w-[236px] bg-primary text-white rounded-br sm:rounded"
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
