import React from "react";
import { FiX } from "react-icons/fi";

const FollowingModal = ({
  setIsOpenFollowingModal,
}: {
  setIsOpenFollowingModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)]" />
      <div className="w-[588px] h-[820px] bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="w-10 aspect-square absolute mt-7 ml-[500px]"
          onClick={() => setIsOpenFollowingModal(false)}
        >
          <FiX className="w-full h-full text-[#acacac]" />
        </button>

        <div className="text-[40px] font-bold mt-[88px]">프로필 편집</div>
      </div>
    </div>
  );
};

export default FollowingModal;
