import React from "react";

const Cate_Navbar = ({
  setCate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="my-1 w-full h-5 flex justify-around">
      <label
        onChange={() => setCate("전체")}
        className=" text-sm  text-center h-full"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
          defaultChecked
        />
        <span className="h-full w-full block peer-checked:font-bold  peer-checked:text-black cursor-pointer">
          전체
        </span>
      </label>
      <label
        onChange={() => setCate("소주")}
        className=" text-sm text-center h-full"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="h-full w-full block peer-checked:font-bold  peer-checked:text-black cursor-pointer ">
          소주
        </span>
      </label>
      <label
        onChange={() => setCate("맥주")}
        className=" text-sm text-center h-full"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="h-full w-full block peer-checked:font-bold  peer-checked:text-black cursor-pointer ">
          맥주
        </span>
      </label>
      <label
        onChange={() => setCate("양주")}
        className=" text-sm text-center h-full"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="h-full w-full block  peer-checked:font-bold  peer-checked:text-black cursor-pointer ">
          양주
        </span>
      </label>
      <label
        onChange={() => setCate("기타")}
        className=" text-sm text-center h-full"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="h-full w-full block  peer-checked:font-bold  peer-checked:text-black cursor-pointer ">
          기타
        </span>
      </label>
    </nav>
  );
};

export default Cate_Navbar;
