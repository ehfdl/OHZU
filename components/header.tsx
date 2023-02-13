import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

const Header = ({ isOpen, setIsOpen }: any) => {
  const [dropDown, setDropDown] = useState(false);
  const [loginModalState, setLoginModalState] = useState(false);
  const [joinModalState, setJoinModalState] = useState(false);

  console.log("isOpen : ", isOpen);

  // 헤더 드랍다운 아이콘 클릭 시, 토글 기능
  const iconToggle = () => {
    setDropDown(!dropDown);
    console.log("클릭 성공", dropDown);
  };

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
    <div className=" flex w-full justify-between  p-4 bg-[#ffa]">
      <div className="emptyBox w-24 bg-slate-200"></div>
      <Link legacyBehavior href="/">
        <div className="Logo  cursor-pointer">Logo</div>
      </Link>
      <div className="iconWrap w-24 flex justify-end relative">
        <FaUser className="w-6 h-6 " onClick={iconToggle} />
        {dropDown ? (
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-300 absolute top-[28px]"
            aria-labelledby="dropdownHoverButton"
          >
            <li onClick={loginModalHandler}>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                로그인
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                회원가입
              </a>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
