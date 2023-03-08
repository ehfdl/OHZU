import React from "react";

const RankInformationModal = () => {
  return (
    <div className=" mt-3 py-[15px] px-[17px] rounded bg-white border-primary border-[1px] z-10 flex flex-col justify-start absolute">
      <div className="text-[14px] font-bold ">회원등급 안내</div>
      <div className="ml-5 mt-2 flex flex-col gap-1">
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-gold.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Gold</span>
            <span>51잔 이상</span>
          </div>
        </div>
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-silver.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Silver</span>
            <span>31~50잔</span>
          </div>
        </div>
        <div className="flex gap-[10px] items-center">
          <img src="/badge/badge-bronze.png" className="w-[9.5px] h-3" />
          <div className="flex justify-between text-[12px] w-[120px]">
            <span>Bronze</span>
            <span>0~30잔</span>
          </div>
        </div>
      </div>
      <div className="mt-3 ml-3 ">
        <ul className="text-xs list-disc space-y-1">
          <li>작성한 게시물에 좋아요 받을시 1잔 적립</li>
          <li>게시물 작성시 5잔 적립</li>
        </ul>
      </div>
    </div>
  );
};

export default RankInformationModal;
