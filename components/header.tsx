import { authService } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import LOGO_Ohju from "../public/LOGO_Ohju.png";
import Image from "next/image";
import Search from "./search";
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

  // 로그인/로그아웃 버튼 스위치
  useEffect(() => {
    if (authService.currentUser?.uid) {
      setCurrentUser(true);
      props.setIsOpen(false);
    } else if (!authService.currentUser?.uid) {
      setCurrentUser(false);
      props.setIsOpen(false);
    }
  }, [props.setIsOpen]);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      setCurrentUser(true);
      props.setIsOpen(false);
    } else if (!authService.currentUser?.uid) {
      setCurrentUser(false);
      props.setIsOpen(false);
    }
  }, [props.setJoinIsOpen]);

  // 로그아웃
  const logOut = () => {
    signOut(authService)
      .then(() => {
        setCurrentUser(false);
        props.setJoinIsOpen(false);
        props.setIsOpen(false);

        alert("로그아웃 되었습니다.");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // 검색

  return (
    <div className="flex w-full h-[118px] sticky top-0 z-[8] justify-between items-center bg-white">
      <Link legacyBehavior href="/">
        <div className="Logo ml-[32px] w-[200px;] h-[60px] justify-center flex items-center cursor-pointer">
          <Image src={LOGO_Ohju} alt="Ohju LOGO" />
        </div>
      </Link>
      <div className="iconWrap h-[80px] mr-[32px] flex justify-end items-center relative ">
        {/* 검색 컴포넌트 */}
        {/* 여기에 search props 시작해서 넘겨줘야 하나..? */}
        <Search />
        {/* 로그인 유무에 따른 버튼 텍스트 변화 */}
        <div className="flex items-center">
          {authService.currentUser ? (
            authService.currentUser?.uid === "r9TWnAGKsxgOoKmZf4IfCLxf0Ry2" ? (
              <Link legacyBehavior href="/ohzu">
                <button className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]">
                  관리페이지
                </button>
              </Link>
            ) : (
              <>
                <Alarm />
                <Link legacyBehavior href="/mypage">
                  <button className="w-20 h-[42px]  duration-150 hover:text-[#FF6161]">
                    마이페이지
                  </button>
                </Link>
              </>
            )
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
