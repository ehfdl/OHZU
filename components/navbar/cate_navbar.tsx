import React from "react";

const Cate_Navbar = ({
  setCate,
  cate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
  cate: string;
}) => {
  return (
    <nav className="mt-5 sm:mt-6 w-full sm:w-[524px] flex justify-around sm:justify-between text-[14px] sm:text-[20px]">
      <label
        onChange={() => setCate("전체")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
          checked={cate === "전체"}
          readOnly
        />
        <span className="block peer-checked:font-bold  peer-checked:text-primary cursor-pointer">
          전체
        </span>
      </label>
      <label
        onChange={() => setCate("소주")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="block peer-checked:font-bold  peer-checked:text-primary cursor-pointer">
          소주
        </span>
      </label>
      <label
        onChange={() => setCate("맥주")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="block peer-checked:font-bold  peer-checked:text-primary cursor-pointer">
          맥주
        </span>
      </label>
      <label
        onChange={() => setCate("양주")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="block peer-checked:font-bold  peer-checked:text-primary cursor-pointer">
          양주
        </span>
      </label>
      <label
        onChange={() => setCate("기타")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className=" block peer-checked:font-bold  peer-checked:text-primary cursor-pointer">
          기타
        </span>
      </label>
    </nav>
  );
};

export default Cate_Navbar;
