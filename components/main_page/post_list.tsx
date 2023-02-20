import PostCard from "./post_card";
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
import React, { useEffect, useState, useRef, ReactElement } from "react";

import Grade from "@/components/grade";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react"; // basic
import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  SwiperModule,
  SwiperOptions,
  NavigationEvents,
  NavigationMethods,
  NavigationOptions,
  SwiperEvents,
} from "swiper/types";
import Category from "./Category";

SwiperCore.use([Navigation, Scrollbar, Pagination]);

const PostList = () => {
  // const userId = window.location.pathname.substring(7);
  const [myProfile, setMyProfile] = useState<any>();
  const [userProfile, setUserProfile] = useState<any>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [user, setUser] = useState<UserType[]>([]);
  const [cate, setCate] = useState("전체");
  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [userLikePosts, setUserLikePosts] = useState<PostType[]>();
  const [userViewPosts, setUserViewPosts] = useState<PostType[]>();
  const [userLike, setUserLike] = useState<number>();
  const swiper = useSwiper();

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const q = query(
      collection(dbService, "Posts"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const newMyPosts = snapshot.docs.map((doc) => {
        const newMyPost: PostType = {
          postId: doc.id,
          ...doc.data(),
        };
        return newMyPost;
      });
      setPosts(newMyPosts);
    });
  }, []);

  // const getUsers = async () => {
  //   const snapshot = await getDoc(doc(dbService, "Users", userId));
  //   const snapshotdata = await snapshot.data(); // 가져온 doc의 객체 내용
  //   const newProfile = {
  //     ...snapshotdata,
  //   };
  //   setUser(newProfile as any);
  // };

  // useEffect(() => {
  //   getUsers();
  //   return;
  // }, []);

  const getUser = async () => {
    const userRef = doc(dbService, "Users", "userId");
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const newUser = {
      ...userData,
    };

    setUser(newUser as any);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {/* <div className="sm:max-w-[1200px] mx-auto justify-center items-center mb-4 ">
        <p className="float-left font-bold text-xl mt-10">전체 게시글</p>
        <span className="float-left ml-2 mt-10 pt-0.5 font-base text-base text-gray-400">
          300
        </span>
        <PostList />

        좋아요 많이 받은 오주 목록
        <div className="mt-16">
          <p className="float-left font-bold text-xl">인기 많은 오주</p>
          <PostList />
        </div>

        조회수 많은 오주 목록
        <div className="mt-16">
          <p className="float-left font-bold text-xl">많이 본 오주</p>
          <PostList />
        </div>
      </div> */}

      <div className="w-full flex justify-center mb-4 min-h-screen">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <Category setCate={setCate} />
          <div className="w-full mt-12 flex justify-between">
            <div className="text-xl font-bold">
              전체 게시글{" "}
              <span className="text-[#ff6161]">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
              <span className="float-right ml-2 pt-1 font-base text-base text-[#ff6161]">
                300
              </span>
            </div>
          </div>
          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            {posts?.map((post: any) => (
              <div key={post.postId}>
                <PostCard post={post} user={user} />
              </div>
            ))}
          </div>

          <div className="w-full mt-16 h-[900px] relative overflow-hidden">
            <div className="text-xl font-bold mb-3">
              인기 많은 오주
              <span className="text-[#ff6161]">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <>
              <Swiper
                spaceBetween={24}
                slidesPerView={3}
                scrollbar={{ draggable: true }}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                  },
                }}
              >
                <button onClick={() => swiper.slideNext()}>
                  slide to the next
                </button>
                <div>
                  {posts?.map((post: any) => (
                    <SwiperSlide key={post.postId}>
                      <PostCard post={post} user={user} />
                    </SwiperSlide>
                  ))}{" "}
                </div>
              </Swiper>
            </>
          </div>

          {posts?.map((post: any) => (
            <div
              key={post.postId}
              className="w-full mt-4 bg-white grid grid-cols-2 gap-6"
            >
              {post === "최신순"
                ? userPosts?.map((post) =>
                    cate === "전체" ? (
                      <PostCard post={post} user={user} />
                    ) : cate === post.type ? (
                      <PostCard post={post} user={user} />
                    ) : null
                  )
                : post === "인기순"
                ? userLikePosts?.map((post) =>
                    cate === "전체" ? (
                      <PostCard post={post} user={user} />
                    ) : cate === post.type ? (
                      <PostCard post={post} user={user} />
                    ) : null
                  )
                : post === "조회순"
                ? userViewPosts?.map((post) =>
                    cate === "전체" ? (
                      <PostCard post={post} user={user} />
                    ) : cate === post.type ? (
                      <PostCard post={post} user={user} />
                    ) : null
                  )
                : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
