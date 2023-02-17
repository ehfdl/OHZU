import React, { useMemo, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const UserDropdown = ({
  setCateDrop,
  cateDrop,
}: {
  setCateDrop: React.Dispatch<React.SetStateAction<string>>;
  cateDrop: string;
}) => {
  return (
    <div className="w-[124px] bg-slate-300">
      <div>
        <span>{cateDrop}</span>
        <span></span>
      </div>
      <div className="w-[124px] h-[104px] rounded bg-white border-[#ff6161] border-[1px] z-10 flex flex-col justify-around items-center absolute">
        <div onClick={() => setCateDrop("인기순")} className="w-full bg-[]">
          인기순
        </div>
        <div className="border-[1px] boreder-[#c9c5c5] w-[113px]" />
        <div onClick={() => setCateDrop("조회순")}>조회순</div>
        <div className="border-[1px] boreder-[#c9c5c5] w-[113px]" />
        <div onClick={() => setCateDrop("댓글순")}>댓글순</div>
      </div>
    </div>
  );
};

export default UserDropdown;

{
  /* <select className="w-[124px] border-[1px] border-black cursor-pointer">
      <option className="w-[124px] bg-slate-100"> 안녕</option>
      <option className="w-[124px] bg-slate-100"> 못해</option>
      <option className="w-[124px] bg-slate-100"> 하윙</option>
    </select> */
}
