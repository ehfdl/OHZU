import React from "react";

const Ohju_Navbar = ({
  setOhju,
}: {
  setOhju: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <nav className="w-[816px] text-[32px] mt-11 flex justify-around navbar">
      <label
        onChange={() => setOhju("my-ohju")}
        className="w-[220px]  text-slate-500 text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="my-ohju"
          defaultChecked
          className="hidden peer"
        />
        <span className="w-full block cursor-pointer peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-black peer-checked:border-black">
          나만의 오주
        </span>
      </label>
      <label
        onChange={() => setOhju("like-ohju")}
        className="w-[220px]  text-slate-500 text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="like-ohju"
          className="hidden peer"
        />
        <span className="w-full block cursor-pointer peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-black peer-checked:border-black">
          좋아한 오주
        </span>
      </label>
      <label
        onChange={() => setOhju("recently-ohju")}
        className="w-[220px]  text-slate-500 text-center"
      >
        <input
          type="radio"
          name="ohju-type"
          value="recently-ohju"
          className="hidden peer"
        />
        <span className="w-full block cursor-pointer peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-black peer-checked:border-black">
          최근 본 오주
        </span>
      </label>
    </nav>
  );
};

export default Ohju_Navbar;
