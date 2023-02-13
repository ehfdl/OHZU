import React from "react";

const Ohju_Navbar = ({
  setOhju,
}: {
  setOhju: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="w-11/12 h-7 mb-3 flex justify-around navbar">
      <label
        onChange={() => setOhju("my-ohju")}
        className=" w-[45%] text-lg text-slate-500 text-center font-bold h-full"
      >
        <input
          type="radio"
          name="ohju-type"
          value="my-ohju"
          defaultChecked
          className="hidden peer"
        />
        <span className="h-full w-full block cursor-pointer  peer-checked:border-b-2 peer-checked:text-black peer-checked:border-black ">
          나만의 오주
        </span>
      </label>
      <label
        onChange={() => setOhju("like-ohju")}
        className=" w-[45%] text-lg text-slate-500 text-center font-bold h-full"
      >
        <input
          type="radio"
          name="ohju-type"
          value="like-ohju"
          className="hidden peer"
        />
        <span className="h-full w-full block cursor-pointer  peer-checked:border-b-2 peer-checked:text-black peer-checked:border-black ">
          좋아한 오주
        </span>
      </label>
    </nav>
  );
};

export default Ohju_Navbar;
