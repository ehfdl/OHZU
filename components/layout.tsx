import Header from "./header";
import Footer from "./footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import WriteButton from "./write_btn";
import TopButton from "./top_btn";
import { authService } from "@/firebase";
import GlobalModal from "./modal/global_modal";
import useModal from "@/hooks/useModal";

const Layout = ({ children }: { children: any }) => {
  const [pageUrl, setPageUrl] = useState("/main");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { showModal } = useModal();

  useEffect(() => {
    const Url = router.pathname;
    setPageUrl(Url);
  }, []);

  return (
    <div>
      <GlobalModal />

      <Header search={search} setSearch={setSearch} />
      <div>{children}</div>
      {pageUrl === "/main" ||
      pageUrl.includes("/users") ||
      pageUrl === "/mypage" ? (
        <>
          {authService.currentUser ? (
            <Link aria-label="write-btn" href="/post/write">
              <WriteButton />
            </Link>
          ) : (
            <>
              <div
                onClick={() =>
                  showModal({
                    modalType: "ConfirmModal",
                    modalProps: {
                      title: "로그인 후 이용 가능합니다.",
                      text: "로그인 페이지로 이동하시겠어요?",
                      rightbtnfunc: () => {
                        showModal({
                          modalType: "LoginModal",
                          modalProps: {},
                        });
                      },
                    },
                  })
                }
              >
                <WriteButton />
              </div>
            </>
          )}
          <TopButton />
        </>
      ) : null}

      <Footer />
    </div>
  );
};

export default Layout;
