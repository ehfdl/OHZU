import Header from "./header";
import Footer from "./footer";
import JoinModal from "./JoinModal";
import LoginModal from "./login_modal";

const Layout = ({ children }: { children: any }) => {
  return (
    <div>
      {/* <LoginModal /> */}
      {/* <JoinModal /> */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
