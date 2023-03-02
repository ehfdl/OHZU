import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-[400px] bg-second">
      <div className="topContentsWrap flex justify-between items-center">
        <div className="inline-block mt-[86px] ml-[69px]">
          <Link href={`/`}>
            <Image
              className="w-[164px] h-[42px]"
              src="/LOGO.svg"
              width="100"
              height="100"
              alt="OHZU LOGO"
            />
          </Link>
        </div>
        <ul className="flex justify-between max-w-[541px] w-full mr-[183px] text-xs">
          <Link href="/temporary">
            <li>브랜드 소개</li>
          </Link>
          <Link href="/temporary">
            <li>이용약관</li>
          </Link>
          <Link href="/temporary">
            <li>공지사항</li>
          </Link>
          <Link href="/temporary">
            <li>개인정보 처리방침</li>
          </Link>
        </ul>
      </div>
      <div></div>
    </div>
  );
};

export default Footer;
