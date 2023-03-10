import { apiKey, authService, dbService } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import LOGO_Ohju from "../public/LOGO.svg";
import Image from "next/image";
import Alarm from "./sub_page/alarm";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import { doc, getDoc } from "firebase/firestore";
import ProfileGrade from "./profile_grade";

const Header = ({ ...props }: any) => {
  // login, logout 상태변화 감지
  const [currentUser, setCurrentUser] = useState(false);
  const [user, setUser] = useState<any>();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [ssuid, setSsuid] = useState<any>("");

  const { showModal, hideModal } = useModal();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(false);

  const getUser = async () => {
    if (authService.currentUser?.uid) {
      const userRef = doc(
        dbService,
        "Users",
        authService.currentUser?.uid as string
      );
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userProfile = {
        ...userData,
      };

      setUser(userProfile);
    }
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Firebase 연결되면 화면 표시
      // user === authService.currentUser 와 같은 값
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      getUser();
    }
  }, [isLoggedIn]);

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
            pathname: "/main",
          });
      })
      .catch((err) => {
        const message = err.message("로그아웃에 실패했습니다.");
        showModal({ modalType: "AlertModal", modalProps: { title: message } });
      });
  };

  // 검색 키워드를 담는 함수
  const SearchHandler = (keyword: any) => {
    setSearch(keyword);
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    if (search) {
      router.push({
        pathname: "/search/keyword",
        query: {
          search,
        },
      });
    } else if (!search) {
      router.push({
        pathname: `/search/-`,
      });
    }
  };

  // 모바일 검색 실행 시, 검색 모달 닫히는 함수
  const mobileSearchToggle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setTimeout(() => {
        setMobileSearch(false);
      }, 300);
    }
  };

  return (
    <>
      <div className="flex w-full sm:h-[118px] h-[50px] sm:sticky top-0 left-0 z-[8] justify-between items-center bg-white">
        <Link aria-label="home" href="/main">
          <div className="Logo sm:ml-[32px] sm:w-[200px;] sm:h-[60px] ml-5 w-[94px] h-6 justify-center flex items-center cursor-pointer">
            <Image src={LOGO_Ohju} alt="Ohju LOGO" priority />
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
                  aria-label="m_search"
                  onChange={(e) => {
                    SearchHandler(e.target.value);
                  }}
                  value={search}
                  type="text"
                  id="m_search"
                  className="hidden lg:block w-[419px] pl-10 p-2.5 bg-[#f2f2f2] border text-sm rounded-[50px] focus:outline-none  placeholder:text-iconDefault focus:ring-[#aaa] focus:border-[#aaa]"
                  placeholder="혼합주 이름 또는 재료를 입력해주세요."
                  required
                />
              )}
            </div>
            {/* 모바일에서 검색 아이콘 눌렀을 때 표시되는 검색창 */}
            {mobileSearch === true ? (
              <>
                <div className=" w-full h-full bg-[#3e3e3e] fixed top-0 left-0 z-5 opacity-[0.95] z-50" />
                <div className=" w-full h-full fixed top-0 left-0 z-50">
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
                      className="absolute top-1/2 left-0 translate-y-[-50%] mr-1 cursor-pointer "
                    />
                    <div className="searchWrap">
                      <Image
                        src="/image/search.svg"
                        width="18"
                        height="18"
                        alt="검색 아이콘"
                        priority={true}
                        className="absolute top-1/2 left-12 translate-y-[-50%] mr-1 cursor-pointer "
                      />
                      <input
                        onChange={(e) => {
                          SearchHandler(e.target.value);
                        }}
                        onKeyDown={(e) => mobileSearchToggle(e)}
                        value={search}
                        type="text"
                        id="simple-search"
                        className=" max-w-[315px] w-full h-[50px]  bg-white border text-sm rounded-[100px] focus:ring-blue-500 focus:border-blue-500 pl-[50px] p-2.5 placeholder:text-iconHover  "
                        placeholder="혼합주 이름 또는 재료를 입력해주세요."
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
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
              className="cursor-pointer lg:hidden mr-2"
              onClick={() => {
                setMobileSearch(true);
              }}
            />

            {!authService.currentUser ? null : <Alarm ssuid={ssuid} />}

            {authService.currentUser || ssuid ? (
              authService.currentUser?.uid ===
              "DllfZJxOSgRqHvF37aJV1RLsPFy2" ? (
                <Link aria-label="manage-page" href="/ohzu">
                  <div className="sm:text-[18px]  sm:duration-150 sm:hover:text-primary">
                    <span className="hidden sm:block">관리페이지</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link aria-label="my-page" href="/mypage">
                    <div className="sm:text-[18px]  sm:duration-150 sm:hover:text-primary">
                      <span className="hidden sm:block">마이페이지</span>
                    </div>
                  </Link>
                </>
              )
            ) : (
              <button
                aria-label="login-modal"
                onClick={() => {
                  showModal({
                    modalType: "LoginModal",
                    modalProps: { logOut },
                  });
                }}
                className=" sm:text-[18px] sm:duration-150 sm:hover:text-primary mr-4"
              >
                <span className="hidden sm:block">로그인</span>
              </button>
            )}
            {!authService.currentUser ? (
              <Image
                src="/image/m(notLogin)_mypage.svg"
                width="32"
                height="32"
                alt="마이페이지"
                className="sm:hidden mr-4 cursor-pointer"
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
              <div
                onClick={() => {
                  if (!authService.currentUser) {
                    showModal({ modalType: "LoginModal", modalProps: {} });
                  } else if (authService.currentUser) {
                    router.push(`/mypage`);
                  }
                }}
              >
                {user && (
                  <ProfileGrade img={user.imageURL} point={user.point} />
                )}
              </div>
            )}

            {authService.currentUser || ssuid ? (
              <button
                aria-label="logout-modal"
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
                className="sm:text-[18px] sm:duration-150 sm:hover:text-primary"
              >
                <span className="hidden sm:block">로그아웃</span>
              </button>
            ) : (
              <button
                aria-label="sign-up-modal"
                onClick={() => {
                  showModal({
                    modalType: "JoinModal",
                    modalProps: {},
                  });
                }}
                className="sm:text-[18px] sm:duration-150 sm:hover:text-primary"
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
