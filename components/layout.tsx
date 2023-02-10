import Header from "./header";
import Footer from "./footer";
import JoinModal from "./join_modal";

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="max-w-sm mx-auto">
      {/* <LoginModal /> */}
      {/* <JoinModal /> */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
