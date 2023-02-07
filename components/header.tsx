const Header = () => {
  return (
    <div className="container flex justify-between  p-4 bg-[#f2f2f2]">
      <div className="emptyBox w-24 "></div>
      <div className="Logo">Logo</div>
      <div className="iconWrap w-24 flex justify-end">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-6 h-6"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Header;
