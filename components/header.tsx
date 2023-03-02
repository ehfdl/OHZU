import { apiKey, authService } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import LOGO_Ohju from "../public/LOGO.svg";
import Image from "next/image";
import Alarm from "./sub_page/alarm";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";

const Header = ({ ...props }: any) => {
  // login, logout 상태변화 감지
  const [currentUser, setCurrentUser] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [ssuid, setSsuid] = useState<any>("");

  const { showModal, hideModal } = useModal();

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
    }
  }, []);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      setCurrentUser(true);
      // props.setIsOpen(false);
    } else if (!authService.currentUser?.uid) {
      setCurrentUser(false);
    }
  }, [props.setJoinIsOpen]);

  // 로그아웃
  const logOut = () => {
    signOut(authService)
      .then(() => {
        sessionStorage.removeItem(apiKey as string);
        setSsuid("");
        setCurrentUser(false);
        hideModal();
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
    <div className="flex w-full sm:h-[118px] mt-5 sticky top-0 z-[8] justify-between items-center bg-white">
      <Link legacyBehavior href="/">
        <div className="Logo sm:ml-[32px] sm:w-[200px;] sm:h-[60px] ml-5 w-[94px] h-6 justify-center flex items-center cursor-pointer">
          <Image src={LOGO_Ohju} alt="Ohju LOGO" />
        </div>
      </Link>
      <div className="iconWrap sm:h-[80px] h-6 sm:mr-[32px] flex justify-end items-center relative ">
        {/* <Image
          src="/image/search.svg"
          width="20"
          height="18"
          alt="검색 아이콘"
          className="cursor-pointer sm:hidden"
          onClick={() => {}}
        /> */}
        <form
          className="sm:mr-9 flex items-center hidden sm:block"
          onSubmit={onSubmitHandler}
        >
          <label htmlFor="simple-search" className=""></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image
                src="/image/search.svg"
                width="24"
                height="24"
                alt="검색 아이콘"
                className="cursor-pointer sm:block"
              />
            </div>
            <input
              onChange={(e) => {
                SearchHanlder(e.target.value);
              }}
              value={search}
              type="text"
              id="simple-search"
              className="w-[419px] bg-[#f2f2f2] border  text-phGray text-sm rounded-[50px] focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 sm:block hidden"
              placeholder="혼합주 이름 또는 재료를 입력해주세요."
              required
            />
          </div>
        </form>

        {/* 반응형 아님 */}
        {/* <form className="mr-9 flex items-center bg-" onSubmit={onSubmitHandler}>
          <label htmlFor="simple-search" className=""></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image
                src="/image/search.svg"
                width="24"
                height="24"
                alt="검색 아이콘"
                className="cursor-pointer sm:block"
              />
            </div>
            <input
              onChange={(e) => {
                SearchHanlder(e.target.value);
              }}
              value={search}
              type="text"
              id="simple-search"
              className="w-[419px] bg-[#f2f2f2] border  text-phGray text-sm rounded-[50px] focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5"
              placeholder="혼합주 이름 또는 재료를 입력해주세요."
              required
            />
          </div>
        </form> */}

        {/* 로그인 유무에 따른 버튼 텍스트 변화 */}
        <div className="flex items-center sm:gap-6 mr-5 ml-1 sm:ml-0 sm:mr-0 ">
          <Image
            src="/image/search.svg"
            width="20"
            height="18"
            alt="검색 아이콘"
            className="cursor-pointer sm:hidden mr-1"
            onClick={() => {}}
          />
          {authService.currentUser || ssuid ? (
            authService.currentUser?.uid === "cQEpUpvxr4R5azgOTGgdjzKjS7z1" ? (
              <Link legacyBehavior href="/ohzu">
                <button className="sm:w-20 sm:h-[42px] sm:text-[18px]  sm:duration-150 sm:hover:text-primary">
                  <span className="hidden sm:block">관리페이지</span>
                </button>
              </Link>
            ) : (
              <>
                <Alarm ssuid={ssuid} />
                <Link legacyBehavior href="/mypage">
                  <button className="sm:w-20 sm:h-[42px] sm:text-[18px]  sm:duration-150 sm:hover:text-primary">
                    <span className="hidden sm:block">마이페이지</span>
                  </button>
                </Link>
              </>
            )
          ) : (
            <button
              onClick={() => {
                showModal({
                  modalType: "LoginModal",
                  modalProps: {},
                });
              }}
              className="sm:w-20 sm:h-[42px] sm:text-[18px] sm:duration-150 sm:hover:text-primary mr-4"
            >
              <span className="hidden sm:block">로그인</span>
            </button>
          )}
          {authService.currentUser || ssuid ? (
            <button
              onClick={() =>
                showModal({
                  modalType: "ConfirmModal",
                  modalProps: {
                    title: "로그아웃",
                    text: "정말 로그아웃 하시겠어요?",
                    rightbtntext: "로그아웃",
                    rightbtnfunc: logOut,
                  },
                })
              }
              className="sm:w-20 sm:h-[42px] sm:text-[18px] sm:duration-150 sm:hover:text-primary"
            >
              <span className="hidden sm:block">로그아웃</span>
            </button>
          ) : (
            <button
              onClick={() => {
                showModal({
                  modalType: "JoinModal",
                  modalProps: {},
                });
              }}
              className="sm:w-20 sm:h-[42px]  sm:text-[18px] sm:duration-150 sm:hover:text-primary"
            >
              <span className="hidden sm:block">회원가입</span>
            </button>
          )}

          <Image
            src="/image/user.svg"
            width="24"
            height="24"
            alt="마이페이지"
            className="cursor-pointer block sm:hidden ml-[-4px]"
            onClick={() => {
              if (!authService.currentUser) {
                showModal({ modalType: "LoginModal", modalProps: {} });
              } else if (authService.currentUser) {
                router.push(`/mypage`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
