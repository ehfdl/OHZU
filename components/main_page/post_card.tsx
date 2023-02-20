import { authService, dbService } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const PostCard = ({ post, user }: { post: any; user: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  const like = post.like.includes(authService.currentUser?.uid);
  // const [user, setUser] = useState<UserType>();
  const onClickLikeBtn = async () => {
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
    <div>
      <div
        key={post.postId}
        className="border shadow mt-3 overflow-hidden rounded hover:border-[#FF6161]/20 hover:shadow-xl hover:shadow-[#FF9999]/70"
      >
        <div>
          <Link href={`/post/${post.postId}`}>
            <img
              src={post.img[0] || defaultImg}
              className="flex w-full h-[284px] object-cover"
            />
          </Link>
        </div>
        <div className="h-[136px]">
          <div className="mt-5 ml-3 flex items-center w-full">
            {post.userId === authService.currentUser?.uid ? (
              <Link href="/mypage">
                <div className="">
                  <img
                    className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer"
                    src={user?.imageURL}
                    alt=""
                  />
                </div>
              </Link>
            ) : (
              <Link href={`/users/${post.userId}`}>
                <div className="">
                  <img
                    className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer"
                    src={user?.imageURL}
                  />
                </div>
              </Link>
            )}

            <div className="float-left">
              <div className="text-xl font-semibold w-[180px]">
                {post.title}
              </div>

              <div className="text-sm font-thin" key={user.userId}>
                <p className="text-gray-900 leading-none">{user?.nickname}</p>
              </div>
            </div>
            <div
              onClick={onClickLikeBtn}
              className="float-right translate-x-[98px] translate-y-[10px] w-6 mb-2"
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
          </div>

          <div className="font-base text-black/60 text-sm mx-5 mt-5 mb-2">
            {post.text}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
