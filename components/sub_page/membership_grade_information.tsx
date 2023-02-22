import React from "react";

const RankInformationModal = () => {
  return (
    <div className="w-[272px] h-[180px] mt-3 pt-[15px] pl-[17px] rounded bg-white border-primary border-[1px] z-10 flex flex-col justify-start absolute">
      <div className="text-[14px] font-bold ">회원등급 안내</div>
      <div className="ml-5 mt-2 flex flex-col gap-1">
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-gold.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Gold</span>
            <span>501잔 이상</span>
          </div>
        </div>
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-silver.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Silver</span>
            <span>301~500잔</span>
          </div>
        </div>
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-bronze.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Bronze</span>
            <span>0~300잔</span>
          </div>
        </div>
      </div>
      <div className="mt-3 ml-3 mb-7 ">
        <div>
          <span className="font-bold">· </span>
          <span className="text-[12px]">
            작성한 게시글에 좋아요 받을시 1잔 적립
          </span>{" "}
        </div>
        <div>
          <span className="font-bold">· </span>
          <span className="text-[12px]">게시글 작성시 5잔 적립</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default RankInformationModal;
