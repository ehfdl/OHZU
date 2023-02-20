import React from "react";

const RankInformationModal = () => {
  return (
    <div className="w-[307px] h-[260px] ml-[60px] rounded bg-white border-[#ff6161] border-[1px] z-10 flex flex-col justify-start items-center absolute">
      <div className="text-[20px] font-bold mt-11">회원등급 안내</div>
      <div className="mt-5 mb-7 text-sm font-bold">
        <div>· 작성한 게시글에 좋아요 받을시 1잔 적립</div>
        <div>&#183; 게시글 작성시 5잔 적립</div>
      </div>
      <div className="flex gap-[10px] items-center">
        <img src="/badge/badge-gold.png" className="w-[9.5px] h-3" />
        <div className="flex justify-between text-[12px] w-[120px]">
          <span className="font-bold">Gold</span>
          <span>501잔 이상</span>
        </div>
      </div>
      <div className="flex gap-[10px] items-center">
        <img src="/badge/badge-silver.png" className="w-[9.5px] h-3" />
        <div className="flex justify-between text-[12px] w-[120px]">
          <span className="font-bold">Silver</span>
          <span>301~500잔</span>
        </div>
      </div>
      <div className="flex gap-[10px] items-center">
        <img src="/badge/badge-bronze.png" className="w-[9.5px] h-3" />
        <div className="flex justify-between text-[12px] w-[120px]">
          <span className="font-bold">Bronze</span>
          <span>0~300잔</span>
        </div>
      </div>
    </div>
  );
};

export default RankInformationModal;
