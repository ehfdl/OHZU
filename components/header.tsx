import { useState } from "react";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [dropDown, setDropDown] = useState(false);

  const toggle = () => {
    setDropDown(!dropDown);
    console.log("클릭 성공", dropDown);
  };

  return (
    <div className=" flex w-full justify-between  p-4 bg-[#ffa]">
      <div className="emptyBox w-24 "></div>
      <div className="Logo">Logo</div>
      <div className="iconWrap w-24 flex justify-end relative">
        <FaUser className="w-6 h-6 " onClick={toggle} />
        {dropDown ? (
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-300 absolute top-[28px]"
            aria-labelledby="dropdownHoverButton"
          >
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
