import Header from "./header";
import Footer from "./footer";
import LoginModal from "./loginModal";
import JoinModal from "./joinModal";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      {/* <LoginModal /> */}
      {/* <JoinModal /> */}
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
