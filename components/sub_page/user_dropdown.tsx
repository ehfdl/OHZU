import React from "react";

const UserDropdown = ({
  setCateDrop,
  cateDrop,
}: {
  setCateDrop: React.Dispatch<React.SetStateAction<string>>;
  cateDrop: string;
}) => {
  return (
    <div className="w-[111px] h-[132px] rounded bg-white border-[#ff6161] border-[1px] z-30 flex flex-col justify-around absolute">
      <label onChange={() => setCateDrop("최신순")} className="w-full h-[33px]">
        <input
          type="radio"
          name="sort"
          value="comment"
          className="hidden peer"
          defaultChecked={cateDrop === "최신순"}
        />
        <span className="w-full h-full flex justify-center items-center text-[#828293] peer-checked:text-[#ff6161] hover:bg-[#fff0f0] cursor-pointer">
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
        <span className="w-full h-full flex justify-center items-center text-[#828293] peer-checked:text-[#ff6161] hover:bg-[#fff0f0] cursor-pointer">
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
        <span className="w-full h-full flex justify-center items-center text-[#828293] peer-checked:text-[#ff6161] hover:bg-[#fff0f0] cursor-pointer">
          조회순
        </span>
      </label>
    </div>
  );
};

export default UserDropdown;
