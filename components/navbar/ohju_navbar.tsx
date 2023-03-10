import React from "react";

const Ohju_Navbar = ({
  setOhju,
  setCate,
}: {
  setOhju: React.Dispatch<React.SetStateAction<string>>;
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="w-full sm:w-[900px]  h-9 sm:h-14  sm:text-[28px] mt-6 sm:mt-14 flex justify-between">
      <label
        onChange={() => {
          setOhju("my-ohju");
          setCate("전체");
        }}
        className="w-[130px] sm:w-[300px]  text-textGray text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="my-ohju"
          defaultChecked
          className="hidden peer"
        />
        <span className="w-full h-full block cursor-pointer border-b-[1px] border-borderGray peer-checked:font-bold peer-checked:border-b-[3px]  sm:peer-checked:border-b-[5px] peer-checked:text-primary peer-checked:border-primary">
          나만의 오주
        </span>
      </label>
      <label
        onChange={() => {
          setOhju("like-ohju");
          setCate("전체");
        }}
        className="w-[130px] sm:w-[300px]  text-textGray text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="like-ohju"
          className="hidden peer"
        />
        <span className="w-full h-full block cursor-pointer border-b-[1px] border-borderGray  peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
          좋아한 오주
        </span>
      </label>
      <label
        onChange={() => {
          setOhju("recently-ohju");
          setCate("전체");
        }}
        className="w-[130px] sm:w-[300px]  text-textGray text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="recently-ohju"
          className="hidden peer"
        />
        <span className="w-full h-full block cursor-pointer border-b-[1px] border-borderGray peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
          최근 본 오주
        </span>
      </label>
    </nav>
  );
};

export default Ohju_Navbar;
