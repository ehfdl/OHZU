import React, { useEffect } from "react";

const UserDropdown = ({
  setCateDrop,
  cateDrop,
}: {
  setCateDrop: React.Dispatch<React.SetStateAction<string>>;
  cateDrop: string;
}) => {
  return (
    <div className="w-24 sm:w-[111px] text-sm sm:text-base rounded bg-white border-second border-[1px] z-30 flex flex-col justify-around absolute">
      <label onChange={() => setCateDrop("최신순")} className="w-full h-[33px]">
        <input
          type="radio"
          name="sort"
          value="comment"
          className="hidden peer"
          defaultChecked={cateDrop === "최신순"}
        />
        <span className="w-full h-full flex rounded justify-center items-center text-[#828293] peer-checked:text-primary hover:bg-second cursor-pointer">
          최신순
        </span>
      </label>
      <label onChange={() => setCateDrop("인기순")} className="w-full h-[33px]">
        <input
          type="radio"
          name="sort"
          value="comment"
          className="hidden peer"
          defaultChecked={cateDrop === "인기순"}
        />
        <span className="w-full h-full flex rounded justify-center items-center text-[#828293] peer-checked:text-primary hover:bg-second cursor-pointer">
          인기순
        </span>
      </label>
      <label onChange={() => setCateDrop("조회순")} className="w-full h-[33px]">
        <input
          type="radio"
          name="sort"
          value="comment"
          className="hidden peer"
          defaultChecked={cateDrop === "조회순"}
        />
        <span className="w-full h-full flex rounded justify-center items-center text-[#828293] peer-checked:text-primary hover:bg-second cursor-pointer">
          조회순
        </span>
      </label>
    </div>
  );
};

export default UserDropdown;
