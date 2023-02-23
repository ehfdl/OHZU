import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";

const UserPostCard = ({ post }: { post: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  const like = post.like.includes(authService.currentUser?.uid);

  const onClickLikeBtn = async () => {
    if (!authService.currentUser?.uid) {
      alert("로그인이 필요한 서비스입니다.");
      return true;
    }
    const likeArray = post.like.includes(authService.currentUser?.uid);

    if (likeArray) {
      const newLikeArray = post.like.filter(
        (id: any) => id !== authService.currentUser?.uid
      );
      await updateDoc(doc(dbService, "Posts", post.postId), {
        like: newLikeArray,
      });
    } else if (!likeArray) {
      const newLikeArray = post.like.push(authService.currentUser?.uid);
      await updateDoc(doc(dbService, "Posts", post.postId), {
        like: post.like,
      });
    }
  };

  return (
    <div
      key={post.postId}
      className=" aspect-square bg-slate-200 overflow-hidden relative rounded"
    >
      <Link href={`/post/${post.postId}`}>
        <div className="w-full h-[180px] bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>

        <div className="absolute flex flex-col gap-1  pt-9 pl-9 ">
          <div className="text-white font-bold text-[24px]">{post.title}</div>
          <div className="text-[12px] text-[#333333] bg-[rgba(255,255,255,0.5)] h-6 w-[58px] flex justify-center items-center rounded-[20px]">
            {post.type}
          </div>
        </div>
      </Link>
      <div
        onClick={onClickLikeBtn}
        className="absolute flex flex-col items-center w-7 h-7 z-[5]  right-0 mr-9 mt-[42px] cursor-pointer"
      >
        {like ? (
          <img src="/like/like-pressed.png" />
        ) : (
          <img src="/like/like-default.png" />
        )}
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

export default UserPostCard;
