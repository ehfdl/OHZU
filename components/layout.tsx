import Header from "./header";
import Footer from "./footer";
import LoginModal from "./login_Modal";
import JoinModal from "./join_Modal";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      {/* <LoginModal /> */}
      <JoinModal />
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
