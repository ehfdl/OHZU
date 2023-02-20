import Header from "./header";
import Footer from "./footer";
import LoginModal from "./login_modal";
import JoinModal from "./join_modal";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import WriteButton from "./write_btn";
import TopButton from "./top_btn";
import { authService } from "@/firebase";

const Layout = ({ children }: { children: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("/");
  const router = useRouter();

  useEffect(() => {
    const Url = router.pathname;
    setPageUrl(Url);
  }, []);

  return (
    <>
      {isOpen ? (
        <LoginModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setJoinIsOpen={setJoinIsOpen}
        />
      ) : null}
      {joinIsOpen ? (
        <JoinModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          joinIsOpen={joinIsOpen}
          setJoinIsOpen={setJoinIsOpen}
        />
      ) : null}
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        joinIsOpen={joinIsOpen}
        setJoinIsOpen={setJoinIsOpen}
      />
      {children}
      {pageUrl === "/" ||
      pageUrl.includes("/users") ||
      pageUrl === "/mypage" ? (
        <>
          {authService.currentUser ? (
            <Link href="/post/write">
              <WriteButton />
            </Link>
          ) : (
            <>
              <div onClick={() => setIsOpen(true)}>
                <WriteButton />
              </div>
            </>
          )}
          <TopButton />
        </>
      ) : null}

      <Footer />
    </>
  );
};

export default Layout;
