import React from "react";

const RankInformationModal = () => {
  return (
    <div className="w-[307px] h-[260px] ml-[60px] rounded bg-white border-[#ff6161] border-[1px] z-10 flex flex-col justify-start items-center absolute">
      <div className="text-[20px] font-bold mt-11">회원등급 안내</div>
      <div className="mt-5 text-sm ">
        <div>&#183; 작성한 게시글에 좋아요 받을시 1잔 적립</div>
        <div>&#183; 게시글 작성시 5잔 적립</div>
      </div>

      <div>gold</div>
    </div>
  );
};

export default RankInformationModal;
