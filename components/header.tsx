import { FaUser, FaSignInAlt } from "react-icons/fa";

const Header = () => {
  return (
    <div className="container flex justify-between  p-4 bg-[#f2f2f2]">
      <div className="emptyBox w-24 "></div>
      <div className="Logo">Logo</div>
      <div className="iconWrap w-24 flex justify-end">
        <FaUser className="w-6 h-6" />
        <FaSignInAlt className="w-6 h-6 ml-2" />
      </div>
    </div>
  );
};

export default Header;
