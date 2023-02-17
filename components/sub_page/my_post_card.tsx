import Link from "next/link";
import React from "react";

const MyPostCard = ({ post }: { post: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  return (
    <div
      key={post.postId}
      className=" aspect-[4/2.6945169712793735] bg-slate-200 overflow-hidden relative rounded"
    >
      <Link href={`/post/${post.postId}`}>
        <div className="w-full h-2/5 bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>
        <div className="absolute flex flex-col gap-1  pt-6 pl-8 ">
          <div className="text-white font-bold text-[24px]">{post.title}</div>
          <div className="text-[12px] bg-[rgba(255,255,255,0.5)] h-7 w-[54px] flex justify-center items-center rounded-[20px]">
            {post.type}
          </div>
        </div>
      </Link>
      <div className="absolute flex flex-col items-center w-7 h-10 z-10  right-0 mr-6 mt-6">
        <img src="/like/like-default.png" />
        <div className="text-[rgba(255,255,255,0.5)] text-[11px]">
          {post.like.length}
        </div>
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

export default MyPostCard;
