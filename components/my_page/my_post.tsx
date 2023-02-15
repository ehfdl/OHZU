import React from "react";

const MyPostCard = ({ post }: { post: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  return (
    <div
      key={post.postId}
      className="h-64 bg-slate-200 overflow-hidden relative rounded"
    >
      <div className="w-full h-2/5 bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>
      <div className="absolute flex gap-4  pt-7 pl-8 ">
        <span className="text-white font-bold text-[24px]">{post.title}</span>
        <span className="text-[12px] bg-[#d9d9d9] h-7 w-[54px] flex justify-center items-center rounded-[20px]">
          {post.type}
        </span>
      </div>
      <img
        src={post.img[0] || defaultImg}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MyPostCard;
