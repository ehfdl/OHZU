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

  const [mobileSearch, setMobileSearch] = useState(false);

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
        showModal({ modalType: "AlertModal", modalProps: { title: message } });
      });
  };

  // 검색 실행 함수
  const SearchHandler = (keyword: any) => {
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
    <>
      <div className="flex w-full sm:h-[118px] h-[50px] sm:sticky top-0 left-0 z-[8] justify-between items-center bg-white">
        <Link legacyBehavior href="/">
          <div className="Logo sm:ml-[32px] sm:w-[200px;] sm:h-[60px] ml-5 w-[94px] h-6 justify-center flex items-center cursor-pointer">
            <Image src={LOGO_Ohju} alt="Ohju LOGO" priority={true} />
          </div>
        </Link>
        <div className="iconWrap sm:h-[80px] h-6 sm:mr-[32px] flex justify-end items-center relative ">
          <form className="mr-9 flex items-center" onSubmit={onSubmitHandler}>
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
              {/* 모바일 검색창이 활성화가 되면, 웹 검색창은 none상태로 =>  모바일환경에서 검색기능이 제대로 작동함. */}
              {mobileSearch === true ? null : (
                <input
                  onChange={(e) => {
                    SearchHandler(e.target.value);
                  }}
                  value={search}
                  type="text"
                  id="simple-search"
                  className="hidden sm:block w-[419px] pl-10 p-2.5 bg-[#f2f2f2] border text-sm rounded-[50px] focus:ring-none focus:border-none focus:outline-none  "
                  placeholder="혼합주 이름 또는 재료를 입력해주세요."
                  required
                />
              )}
            </div>
            {/* 모바일에서 검색 아이콘 눌렀을 때 표시되는 검색창 */}
            {mobileSearch === true ? (
              <div className="sm:hidden w-full h-full bg-white fixed top-0 left-0 z-50">
                <div className="max-w-[360px] w-full h-[50px] m-auto mt-12 text-center relative">
                  <Image
                    onClick={() => {
                      setMobileSearch(false);
                    }}
                    src="/image/m_arrow.svg"
                    width="12"
                    height="18"
                    alt="검색 나가기 화살표"
                    priority={true}
                    className="absolute top-1/2 left-0 translate-y-[-50%] sm:hidden mr-1 cursor-pointer "
                  />
                  <div className="searchWrap">
                    <Image
                      src="/image/search.svg"
                      width="18"
                      height="18"
                      alt="검색 아이콘"
                      priority={true}
                      className="absolute top-1/2 left-12 translate-y-[-50%] sm:hidden mr-1 cursor-pointer "
                    />
                    <input
                      onChange={(e) => {
                        SearchHandler(e.target.value);
                      }}
                      value={search}
                      type="text"
                      id="simple-search"
                      // priority={true}
                      className="max-w-[315px] w-full h-[50px]  bg-[#f2f2f2] border   text-sm rounded-[100px] focus:ring-blue-500 focus:border-blue-500 pl-[50px] p-2.5  sm:hidden"
                      placeholder="혼합주 이름 또는 재료를 입력해주세요."
                      required
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </form>

          {/* 로그인 유무에 따른 버튼 텍스트 변화 */}
          <div className="flex items-center sm:gap-6 ">
            <Image
              src="/image/m_search.svg"
              width="24"
              height="24"
              alt="검색 아이콘"
              priority={true}
              className="cursor-pointer sm:hidden mr-1"
              onClick={() => {
                setMobileSearch(true);
              }}
            />

            {!authService.currentUser ? (
              <Image
                src="/image/m(notLogin)_mypage.svg"
                width="20"
                height="24"
                alt="마이페이지"
                className="sm:hidden ml-3 cursor-pointer"
                priority={true}
                onClick={() => {
                  if (!authService.currentUser) {
                    showModal({ modalType: "LoginModal", modalProps: {} });
                  } else if (authService.currentUser) {
                    router.push(`/mypage`);
                  }
                }}
              />
            ) : (
              <Image
                src="/image/m(login)_mypage.svg"
                width="20"
                height="24"
                alt="마이페이지"
                className="sm:hidden mx-3 cursor-pointer"
                priority={true}
                onClick={() => {
                  if (!authService.currentUser) {
                    showModal({ modalType: "LoginModal", modalProps: {} });
                  } else if (authService.currentUser) {
                    router.push(`/mypage`);
                  }
                }}
              />
            )}

            {authService.currentUser || ssuid ? (
              authService.currentUser?.uid ===
              "DllfZJxOSgRqHvF37aJV1RLsPFy2" ? (
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
                      title: "로그아웃 하시겠습니까?",
                      rightbtntext: "로그아웃",
                      rightbtnfunc: () => logOut(),
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
