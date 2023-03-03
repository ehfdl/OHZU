import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-[250px] bg-second">
      <div className="topContentsWrap flex justify-between items-center">
        <div className="inline-block mt-[86px] ml-[69px]">
          <Link href={`/`}>
            <Image
              className="w-[164px] h-[42px]"
              src="/LOGO.svg"
              alt="OHZU Logo"
              width="100"
              height="100"
            />
          </Link>
        </div>
        <ul className="flex justify-between max-w-[541px] w-full mr-[183px] text-xs ">
          <Link href="/about" className="duration-150 hover:text-primary">
            <li>브랜드 소개</li>
          </Link>
          <Link href="/temporary" className="duration-150 hover:text-primary">
            <li>이용약관</li>
          </Link>
          <Link href="/temporary" className="duration-150 hover:text-primary">
            <li>공지사항</li>
          </Link>
          <Link href="/temporary" className="duration-150 hover:text-primary">
            <li>개인정보 처리방침</li>
          </Link>
        </ul>
      </div>
      <div></div>
    </div>
  );
};

export default Footer;
