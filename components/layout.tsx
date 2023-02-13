import Header from "./header";
import Footer from "./footer";
import LoginModal from "./login_Modal";
import JoinModal from "./join_Modal";
import { useState } from "react";

const Layout = ({ children }: { children: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? <LoginModal isOpen="false" /> : null}
      {/* <JoinModal /> */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
