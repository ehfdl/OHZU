import React from "react";

const Cate_Navbar = ({
  setCate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="mt-10 w-[550px] flex justify-around text-[20px]">
      <label
        onChange={() => setCate("전체")}
        className="w-[88px] text-slate-500 text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
          defaultChecked
        />
        <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-[#ff6161] peer-checked:text-[#ff6161] cursor-pointer">
          전체
        </span>
      </label>
      <label
        onChange={() => setCate("소주")}
        className="w-[88px] text-slate-500 text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-[#ff6161] peer-checked:text-[#ff6161] cursor-pointer">
          소주
        </span>
      </label>
      <label
        onChange={() => setCate("맥주")}
        className="w-[88px] text-slate-500 text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-[#ff6161] peer-checked:text-[#ff6161] cursor-pointer">
          맥주
        </span>
      </label>
      <label
        onChange={() => setCate("양주")}
        className="w-[88px] text-slate-500 text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-[#ff6161] peer-checked:text-[#ff6161] cursor-pointer">
          양주
        </span>
      </label>
      <label
        onChange={() => setCate("기타")}
        className="w-[88px] text-slate-500 text-center"
      >
        <input
          type="radio"
          name="type"
          value="my-ohju"
          className="hidden peer"
        />
        <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-[#ff6161] peer-checked:text-[#ff6161] cursor-pointer">
          기타
        </span>
      </label>
    </nav>
  );
};

export default Cate_Navbar;
