import { apiKey, authService } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import LOGO_Ohju from "../public/LOGO.svg";
import Image from "next/image";
import Alarm from "./sub_page/alarm";
import { useRouter } from "next/router";

const Header = ({ ...props }: any) => {
  // login, logout 상태변화 감지
  const [currentUser, setCurrentUser] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [ssuid, setSsuid] = useState<any>("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Firebase 연결되면 화면 표시
      // user === authService.currentUser 와 같은 값
      if (user) {
        setIsLoggedIn(true);
        console.log("로그인");
      } else {
        setIsLoggedIn(false);
        console.log("로그아웃");
      }
    });
  }, []);

  useEffect(() => {
    if (sessionStorage) {
      const is_session = sessionStorage.getItem(apiKey as string);
      setSsuid(is_session);
      console.log(is_session);
    }
  }, []);
  // 로그인&회원가입 모달창 show/hidden
  const loginModalHandler = () => {
    if (props.isOpen === false) {
      props.setIsOpen(true);
      setCurrentUser(true);
    }
  };

  const joinModalHandler = () => {
    if (props.joinIsOpen === false) {
      props.setJoinIsOpen(true);
    }
  };

  // 로그인/로그아웃 버튼 스위치
  useEffect(() => {
    if (authService.currentUser?.uid) {
      setCurrentUser(true);
      // props.setIsOpen(false);
    } else if (!authService.currentUser?.uid) {
      setCurrentUser(false);
      // props.setIsOpen(false);
    }
  }, [props.setIsOpen]);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      setCurrentUser(true);
      // props.setIsOpen(false);
    } else if (!authService.currentUser?.uid) {
      setCurrentUser(false);
      // props.setIsOpen(false);
    }
  }, [props.setJoinIsOpen]);

  // 로그아웃
  const logOut = () => {
    signOut(authService)
      .then(() => {
        sessionStorage.removeItem(apiKey as string);
        setSsuid("");
        setCurrentUser(false);
        props.setJoinIsOpen(false);
        props.setIsOpen(false);
        if (
          window.location.pathname === "/mypage" ||
          window.location.pathname === "/post/write" ||
          window.location.pathname.includes("edit")
        )
          router.push({
            pathname: "/",
          });
      })
      .catch((err) => {
        const message = err.message("로그아웃에 실패했습니다.");
        alert(message);
      });
  };
  // 검색 실행 함수
  const SearchHanlder = (keyword: any) => {
    setSearch(keyword);
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    if (search) {
      router.push({
        pathname: `/search/${search}`,
      });
    } else if (!search) {
      router.push({
        pathname: `/search/-`,
      });
    }
  };
  return (
    <div className="flex w-full h-[118px] sticky top-0 z-[8] justify-between items-center bg-white">
      <Link legacyBehavior href="/">
        <div className="Logo ml-[32px] w-[200px;] h-[60px] justify-center flex items-center cursor-pointer">
          <Image src={LOGO_Ohju} alt="Ohju LOGO" />
        </div>
      </Link>
      <div className="iconWrap h-[80px] mr-[32px] flex justify-end items-center relative ">
        <form className="mr-9 flex items-center" onSubmit={onSubmitHandler}>
          <label htmlFor="simple-search" className=""></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-textGray"
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
              onChange={(e) => {
                SearchHanlder(e.target.value);
              }}
              value={search}
              type="text"
              id="simple-search"
              className="w-[419px] bg-[#f2f2f2] border  text-phGray text-sm rounded-[50px] focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  "
              placeholder="혼합주 이름 또는 재료를 입력해주세요."
              required
            />
          </div>
        </form>
        {/* 로그인 유무에 따른 버튼 텍스트 변화 */}
        <div className="flex items-center gap-6">
          {authService.currentUser || ssuid ? (
            authService.currentUser?.uid === "cQEpUpvxr4R5azgOTGgdjzKjS7z1" ? (
              <Link legacyBehavior href="/ohzu">
                <button className="w-20 h-[42px] text-[18px]  duration-150 hover:text-primary">
                  관리페이지
                </button>
              </Link>
            ) : (
              <>
                <Alarm ssuid={ssuid} />
                <Link legacyBehavior href="/mypage">
                  <button className="w-20 h-[42px] text-[18px]  duration-150 hover:text-primary">
                    마이페이지
                  </button>
                </Link>
              </>
            )
          ) : (
            <button
              onClick={loginModalHandler}
              className="w-20 h-[42px] text-[18px] duration-150 hover:text-primary"
            >
              로그인
            </button>
          )}

          {authService.currentUser || ssuid ? (
            <button
              onClick={logOut}
              className="w-20 h-[42px] text-[18px] duration-150 hover:text-primary"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={joinModalHandler}
              className="w-20 h-[42px]  text-[18px] duration-150 hover:text-primary"
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
