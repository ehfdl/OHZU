import React from "react";

const Category = ({
  setCate,
}: {
  setCate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      {/* 웹*/}
      <nav className="hidden sm:flex w-[550px]  justify-around text-[20px]">
        <label
          onChange={() => setCate("전체")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="maintype"
            value="my-ohju"
            className="hidden peer"
            defaultChecked
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-4 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            전체
          </span>
        </label>
        <label
          onChange={() => setCate("소주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="maintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-4 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2 ">
            소주
          </span>
        </label>
        <label
          onChange={() => setCate("맥주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="maintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-4 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            맥주
          </span>
        </label>
        <label
          onChange={() => setCate("양주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="maintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-4 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            양주
          </span>
        </label>
        <label
          onChange={() => setCate("기타")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="maintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-4 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            기타
          </span>
        </label>
      </nav>

      {/* 모바일 */}
      <nav className="sm:hidden max-w-[390px] w-full flex justify-around ">
        <label
          onChange={() => setCate("전체")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="mobilemaintype"
            value="my-ohju"
            className="hidden peer"
            defaultChecked
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            전체
          </span>
        </label>
        <label
          onChange={() => setCate("소주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="mobilemaintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2 ">
            소주
          </span>
        </label>
        <label
          onChange={() => setCate("맥주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="mobilemaintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            맥주
          </span>
        </label>
        <label
          onChange={() => setCate("양주")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="mobilemaintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            양주
          </span>
        </label>
        <label
          onChange={() => setCate("기타")}
          className="w-[88px] text-textGray text-center"
        >
          <input
            type="radio"
            name="mobilemaintype"
            value="my-ohju"
            className="hidden peer"
          />
          <span className="w-full block peer-checked:font-bold peer-checked:border-b-2 peer-checked:border-primary peer-checked:text-primary cursor-pointer pb-2">
            기타
          </span>
        </label>
      </nav>
    </>
  );
};

export default Category;
