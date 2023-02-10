import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import JoinModal from "./JoinModal";

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
