import { authService, dbService } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Grade from "../grade";
import Image from "next/image";
import { Autoplay } from "swiper";

const PostCard = ({ post }: { post: any }) => {
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
    } else if (authService.currentUser?.uid === null) {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  let docId: string;
  if (typeof window !== "undefined") {
    docId = window.location.pathname.substring(6);
  }
  const [user, setUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });

  const getUser = async () => {
    if (post?.userId) {
      const userRef = doc(dbService, "Users", post?.userId! as string);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userProfile = {
        ...userData,
      };

      setUser(userProfile);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex">
      <div key={post.postId} className="sm:mt-1">
        {/* hover:border-[#FF6161]/20 hover:shadow-xl hover:shadow-[#FF9999]/70 */}
        <div className="sm:w-full w-[171px] h-[168px] sm:h-[284px] ">
          <Link href={`/post/${post.postId}`}>
            <Image
              src={post.img[0] || defaultImg}
              className="flex sm:w-[384px] w-[171px] h-[168px] sm:h-[284px] object-cover rounded"
              alt=""
              width={300}
              height={300}
            ></Image>
            <div className="rounded bg-black/0 w-full h-[168px] sm:h-[284px] object-cover -translate-y-[168px] sm:translate-y-[-285px] hover:bg-gray-300/30 hover:block transition"></div>
          </Link>
        </div>
        <div className="sm:h-[136px] h-[105px] sm:w-[384px] bg-white overflow-hidden w-[171px] mb-6 ">
          <div className="sm:group">
            <Link href={`/post/${post.postId}`}>
              <div className="sm:float-left mt-3 sm:mt-2 ml-[1px] text-start sm:ml-[70px] sm:translate-y-[12px] float-none sm:text-[22px] text-base font-bold sm:w-[195px] w-[155px]">
                {post.title}
              </div>
            </Link>
          </div>
          <div className="sm:mt-5 sm:ml-3 flex items-center w-full mt-2">
            {post.userId === authService.currentUser?.uid ? (
              <Link href="/mypage">
                <div>
                  <Image
                    className="sm:w-11 float-left sm:float-none sm:h-11 w-6 h-6 mt-[-13px] rounded-full sm:mb-2 bg-black cursor-pointer"
                    alt=""
                    src={user.imageURL as string}
                    width={300}
                    height={300}
                  />
                </div>
              </Link>
            ) : (
              <Link href={`/users/${post.userId}`}>
                <div>
                  {user.imageURL && (
                    <Image
                      className="sm:w-11 float-left sm:float-none sm:h-11 w-6 h-6 mt-[-13px] rounded-full sm:mb-2 bg-black cursor-pointer"
                      alt=""
                      src={user.imageURL as string}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              </Link>
            )}

            <div className="mb-2">
              <div className="sm:text-sm text-[14px]" key={user.userId}>
                <p className="sm:float-left float-left ml-[8px] sm:mt-[18px] sm:ml-[14px] text-black leading-none -translate-y-[1px]">
                  {user?.nickname}
                </p>
                <span className="sm:float-left float-left w-[11px] h-[14px] sm:mt-[18px]  sm:w-[11px] sm:h-[14px] ml-1 -translate-y-[2px] sm:-translate-y-[2px]">
                  <Grade score={user?.point as number} />
                </span>
              </div>
            </div>

            <div
              onClick={onClickLikeBtn}
              className="absolute flex flex-col float-right w-4 h-4 translate-x-[142px] -translate-y-[200px] sm:translate-x-[330px] sm:-translate-y-[23px] items-center sm:w-[20px] sm:h-[16px] sm:z-[5] sm:mr-6 sm:mt-6 sm:mb-3 cursor-pointer"
            >
              {like ? (
                <Image
                  alt=""
                  src="/like/like-pressed.png"
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  alt=""
                  src="/like/like-default.png"
                  width={20}
                  height={20}
                />
              )}
              <div className="sm:text-[rgba(87,86,86,0.5)] text-[11px] text-white">
                {post.like.length}
              </div>
            </div>
          </div>
          <div className="text-sm mx-[0.5px] text-[#8E8E93] sm:text-sm sm:mx-[13px] sm:mt-1 sm:mb-2 sm:w-[345px] w-[170px] sm:line-clamp-3 line-clamp-2 text-ellipsis break-all font-normal">
            {post.text}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
