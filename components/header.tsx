import { authService } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import LOGO_Ohju from "../public/LOGO_Ohju.png";
import Image from "next/image";
import Alarm from "./sub_page/alarm";

const Header = ({ ...props }: any) => {
  // login, logout 상태변화 감지
  const [currentUser, setCurrentUser] = useState(false);

  // 로그인&회원가입 모달창 show/hidden
  const loginModalHandler = () => {
    if (props.isOpen === false) {
      console.log("Open");
      props.setIsOpen(true);
      setCurrentUser(true);
    }
  };

  const joinModalHandler = () => {
    if (props.joinIsOpen === false) {
      console.log("Open");
      props.setJoinIsOpen(true);
    }
  };

  // 로그아웃
  const logOut = () => {
    signOut(authService)
      .then(() => {
        setCurrentUser(false);
        props.setJoinIsOpen(false);
        props.setIsOpen(false);
        console.log("authService.currentUser : ", authService.currentUser);
        console.log("props.joinIsOpen : ", props.joinIsOpen);
        console.log("props.isOpen : ", props.isOpen);
        alert("로그아웃 되었습니다.");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="flex w-full h-[118px] sticky top-0 z-[8] justify-between items-center border-b-2 border-slate-100 bg-white">
      <Link legacyBehavior href="/">
        <div className="Logo ml-[32px] w-[200px;] h-[60px] justify-center flex items-center cursor-pointer">
          <Image src={LOGO_Ohju} alt="Ohju LOGO" />
        </div>
      </Link>
      <div className="iconWrap h-[80px] mr-[32px] flex justify-end items-center relative ">
        <form
          className="mr-[20px] flex items-center"
          onSubmit={() => alert("Search!")}
        >
          <label htmlFor="simple-search" className=""></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
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
              className="w-80 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[50px] focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  "
              placeholder="혼합주 이름 또는 재료를 입력해주세요."
              required
            />
          </div>
        </form>
        {/* 로그인 유무에 따른 버튼 텍스트 변화 */}
        <div className="flex items-center">
          {authService.currentUser ? (
            <>
              <Alarm />
              <Link legacyBehavior href="/mypage">
                <button className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]">
                  마이페이지
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={loginModalHandler}
              className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]"
            >
              로그인
            </button>
          )}

          {authService.currentUser ? (
            <button
              onClick={logOut}
              className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={joinModalHandler}
              className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]"
            >
              회원가입
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
