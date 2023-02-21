import React from "react";

const UserCateNavbar = ({
  setCate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="mt-12 w-[584px] flex justify-between text-[20px]">
      <label
        onChange={() => setCate("전체")}
        className=" text-[#8e8e93] text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
          defaultChecked
        />
        <span className="w-[89px] peer-checked:border-b-[3px] peer-checked:border-[#ff6161] block peer-checked:font-bold   peer-checked:text-[#ff6161] cursor-pointer">
          전체
        </span>
      </label>
      <label
        onChange={() => setCate("소주")}
        className=" text-[#8e8e93] text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-[89px] peer-checked:border-b-[3px] peer-checked:border-[#ff6161] block peer-checked:font-bold  peer-checked:text-[#ff6161] cursor-pointer">
          소주
        </span>
      </label>
      <label
        onChange={() => setCate("맥주")}
        className=" text-[#8e8e93] text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-[89px] peer-checked:border-b-[3px] peer-checked:border-[#ff6161] block peer-checked:font-bold  peer-checked:text-[#ff6161] cursor-pointer">
          맥주
        </span>
      </label>
      <label
        onChange={() => setCate("양주")}
        className=" text-[#8e8e93] text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-[89px] peer-checked:border-b-[3px] peer-checked:border-[#ff6161] block peer-checked:font-bold  peer-checked:text-[#ff6161] cursor-pointer">
          양주
        </span>
      </label>
      <label
        onChange={() => setCate("기타")}
        className=" text-[#8e8e93] text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-[89px] peer-checked:border-b-[3px] peer-checked:border-[#ff6161] block peer-checked:font-bold  peer-checked:text-[#ff6161] cursor-pointer">
          기타
        </span>
      </label>
    </nav>
  );
};

export default UserCateNavbar;
