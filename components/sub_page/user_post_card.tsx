import Link from "next/link";
import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const UserPostCard = ({ post }: { post: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  return (
    <div
      key={post.postId}
      className=" aspect-[1/0.92] bg-slate-200 overflow-hidden relative rounded"
    >
      <Link href={`/post/${post.postId}`}>
        <div className="w-full h-1/3 bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>

        <div className="absolute flex flex-col gap-1  pt-9 pl-10 ">
          <div className="text-white font-bold text-[24px]">{post.title}</div>
          <div className="text-[12px] bg-[#ffffff] opacity-50 h-6 w-[58px] flex justify-center items-center rounded-[20px]">
            {post.type}
          </div>
        </div>
      </Link>
      <div className="absolute w-7 h-7 z-10  right-0 mr-6 mt-9">
        {/* <AiFillHeart className=" w-7 h-7 text-[#ff6161]" /> */}
        <AiOutlineHeart className=" w-7 h-7 text-[#ff6161]" />
      </div>
      <Link href={`/post/${post.postId}`}>
        <img
          src={post.img[0] || defaultImg}
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
};

export default UserPostCard;
