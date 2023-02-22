import { authService, dbService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Grade from "../grade";

const PostCard = ({ post }: { post: any }) => {
  const defaultImg =
    "https://www.kocis.go.kr/CONTENTS/BOARD/images/map_Soju2_kr.png";

  const like = post.like.includes(authService.currentUser?.uid);
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
  const [postId, setPostId] = useState("");
  const getId = async () => {
    const docRef = doc(dbService, "Posts", docId);
    const docSnap = await getDoc(docRef);
    const docID = docSnap.id;
    setPostId(docID);
  };
  const [userProfile, setUserProfile] = useState<any>();
  const [posts, setPosts] = useState<PostType[]>([]);
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
      <div key={post.postId} className=" border shadow mt-3  rounded ">
        {/* hover:border-[#FF6161]/20 hover:shadow-xl hover:shadow-[#FF9999]/70 */}
        <div className="w-full h-[284px]">

          <Link href={`/post/${post.postId}`}>
            <img
              src={post.img[0] || defaultImg}
              className="flex w-full h-[284px] object-cover"
            />
            <div className=" bg-black/0 w-full h-[284px] object-cover translate-y-[-285px] hover:bg-gray-300/30 hover:block"></div>
          </Link>
        </div>
        <div className="h-[160px] bg-white overflow-hidden ">
          <div className="mt-5 ml-3 flex items-center w-full">
            {post.userId === authService.currentUser?.uid ? (
              <Link href="/mypage">
                <div className="">
                  <img
                    className="w-10 h-10 rounded-full mx-2 mb-2 bg-black cursor-pointer"
                    alt=""
                    src={user?.imageURL}
                  />
                </div>
              </Link>
            ) : (
              <Link href={`/users/${post.userId}`}>
                <div className="">
                  <img
                    className="w-10 h-10 rounded-full mx-2 mb-2 bg-black cursor-pointer"
                    src={user?.imageURL}
                  />
                </div>
              </Link>
            )}

            <div className="mb-2">
              <Link href={`/post/${post.postId}`}>
                <div className="float-left text-xl font-semibold w-[185px]">
                  {post.title}
                </div>
              </Link>

              <div className="text-sm font-thin " key={user.userId}>
                <p className="float-left text-gray-900 leading-none">
                  {user?.nickname}
                </p>
                <span className="float-left w-[10px] h-[10px] ml-1 translate-y-[0px]">
                  <Grade score={user?.point as number} />
                </span>
              </div>
            </div>

            <div
              onClick={onClickLikeBtn}
              className="float-right translate-x-[80px] translate-y-[8px] w-6 mb-2 cursor-pointer"
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
          <div className="font-base text-black/60 text-sm mx-6 mt-2 mb-2 w-[335px] line-clamp-3 text-ellipsis break-all">
            {post.text}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
