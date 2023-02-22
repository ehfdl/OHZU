import React from "react";

const Cate_Navbar = ({
  setCate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="mt-6 w-[524px] flex justify-between text-[20px]">
      <label
        onChange={() => setCate("전체")}
        className=" text-textGray text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
          defaultChecked
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
