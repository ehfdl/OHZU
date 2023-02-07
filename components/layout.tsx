import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
