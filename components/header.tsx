import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

const Header = ({ isOpen, setIsOpen }: any) => {
  const [dropDown, setDropDown] = useState(false);
  const [loginModalState, setLoginModalState] =
    useState(false);
  const [joinModalState, setJoinModalState] =
    useState(false);

  console.log("isOpen : ", isOpen);

  // 헤더 드랍다운 아이콘 클릭 시, show/hidden
  const iconToggle = () => {
    setDropDown(!dropDown);
    console.log("클릭 성공", dropDown);
  };

  // 로그인 모달창 show/hidden
  const loginModalHandler = () => {
    if (isOpen === false) {
      console.log("Open");
      setIsOpen(true);
    } else {
      console.log("Close");
      setIsOpen(false);
    }
  };

  return (
    <div className="flex w-full h-[80px] justify-between items-center bg-[#d0d0d0]">
      <Link legacyBehavior href="/">
        <div className="Logo ml-[32px] cursor-pointer">
          Logo
        </div>
      </Link>
      <div className="iconWrap h-[80px] mr-[32px] flex justify-end items-center relative ">
        <form
          className="mr-[20px] flex items-center"
          onSubmit={() => alert("Search!")}
        >
          <label
            htmlFor="simple-search"
            className=""
          ></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>
        <div className="flex items-center">
          <button className="mr-[8px]">
            로그인
          </button>
          <button>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
