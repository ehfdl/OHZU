import { apiKey, authService } from "@/firebase";
import useModal from "@/hooks/useModal";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Footer = () => {
  const [currentUser, setCurrentUser] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [ssuid, setSsuid] = useState<any>("");
  const { showModal, hideModal } = useModal();

  const logOut = () => {
    signOut(authService)
      .then(() => {
        sessionStorage.removeItem(apiKey as string);
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

  return (
    <>
      {/* 웹 */}
      <div className="hidden sm:block w-full h-[250px] bg-second">
        <div className="topContentsWrap flex h-full justify-between items-center">
          <div className="inline-block ml-[69px]">
            <Link aria-label="home" href={`/main`}>
              <Image
                className="w-[164px] h-[42px]"
                src="/LOGO.svg"
                alt="OHZU Logo"
                width="100"
                height="100"
              />
            </Link>
          </div>
          <div className="flex flex-col max-w-[400px] w-full mr-[183px] text-xs ">
            <nav className="flex justify-between">
              <Link
                aria-label="intro-brand"
                href="/about"
                className="duration-150 hover:text-primary"
              >
                브랜드 소개
              </Link>
              <Link
                aria-label="term"
                href="/temporary"
                className="duration-150 hover:text-primary"
              >
                이용약관
              </Link>
              <Link
                aria-label="announcement"
                href="/temporary"
                className="duration-150 hover:text-primary"
              >
                공지사항
              </Link>
              <Link
                aria-label="privacy"
                href="/temporary"
                className="duration-150 hover:text-primary"
              >
                개인정보 처리방침
              </Link>
            </nav>
            <div className="flex mt-4">
              <a
                aria-label="OHZU Team Notion"
                href={`https://silent-attraction-8d9.notion.site/OHZU-aeb08cd15d9c482f8b95a358b44ef646`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  className="w-[30px] h-[32px]"
                  src="/image/notion.svg"
                  alt="Notion Logo"
                  width="100"
                  height="100"
                />
              </a>
              <a
                aria-label="OHZU Team GitHub"
                href={`https://github.com/ehfdl/OHZU`}
                className="ml-6"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  className="w-[32px] h-[32px]"
                  src="/image/github.svg"
                  alt="github Logo"
                  width="100"
                  height="100"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일*/}
      <div className="sm:hidden flex flex-col w-full h-[328px] bg-second ">
        <div className="topContentsWrap max-w-[390px] mx-auto ">
          <div className="inline-block mt-[51px] ml-5 mb-3 ">
            <Link aria-label="home" href={`/main`}>
              <Image
                className="w-[70px] h-[18px] cursor-pointer"
                src="/LOGO.svg"
                alt="OHZU Logo"
                width="100"
                height="100"
              />
            </Link>
          </div>
          <div className=" text-sm font-semibold text-right mr-[27px] mb-12 cursor-pointer">
            {authService.currentUser ? (
              <span
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
              >
                로그아웃
              </span>
            ) : null}
          </div>
          <nav className="flex justify-center max-w-[333px] w-full m-auto text-xs">
            <Link
              aria-label="intro-brand"
              href="/about"
              className="pr-4 border-r-[1px] border-textGray duration-150 hover:text-primary"
            >
              브랜드 소개
            </Link>
            <Link
              aria-label="term"
              href="/temporary"
              className="pl-4 pr-4 border-r-[1px] border-textGray duration-150 hover:text-primary"
            >
              이용약관
            </Link>
            <Link
              aria-label="announcement"
              href="/temporary"
              className="pl-4 pr-4 border-r-[1px] border-textGray duration-150 hover:text-primary"
            >
              공지사항
            </Link>
            <Link
              aria-label="privacy"
              href="/temporary"
              className="pl-4 duration-150 hover:text-primary"
            >
              개인정보 처리방침
            </Link>
          </nav>
          <div className="flex mt-4">
            <a
              aria-label="OHZU Team Notion"
              href={`https://silent-attraction-8d9.notion.site/OHZU-aeb08cd15d9c482f8b95a358b44ef646`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                className="w-[30px] h-[32px]"
                src="/image/notion.svg"
                alt="Notion Logo"
                width="100"
                height="100"
              />
            </a>
            <a
              aria-label="OHZU Team GitHub"
              href={`https://github.com/ehfdl/OHZU`}
              className="ml-6"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                className="w-[32px] h-[32px]"
                src="/image/github.svg"
                alt="github Logo"
                width="100"
                height="100"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
