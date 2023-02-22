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
import Category from "./Category";
import Grade from "@/components/grade";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react"; // basic
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  EffectCoverflow,
  Mousewheel,
} from "swiper";
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
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const PostList = () => {
  SwiperCore.use([
    EffectCoverflow,
    Navigation,
    Mousewheel,
    Scrollbar,
    Pagination,
  ]);

  const [userProfile, setUserProfile] = useState<any>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [user, setUser] = useState<UserType[]>([]);
  const [cate, setCate] = useState("전체");
  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [userLikePosts, setUserLikePosts] = useState<PostType[]>();
  const [userViewPosts, setUserViewPosts] = useState<PostType[]>();
  const [userLike, setUserLike] = useState<number>();
  const swiper = useSwiper();

  const navigationNextRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef = useRef(null);

  const getUserProfile = async () => {
    const snapshot = await getDoc(doc(dbService, "Users", "nickname"));
    const snapshotdata = await snapshot.data();
    const newProfile = {
      ...snapshotdata,
    };
    setUserProfile(newProfile);
  };

  useEffect(() => {
    const getUserPosts = async () => {
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
    };
    getUserProfile();
    getUserPosts();
  }, []);

  useEffect(() => {
    const totalLike = userPosts?.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.like!.length;
    }, 0);
    setUserLike(totalLike);

    const getLikePosts = () => {
      const Posts = [...posts!];
      const likePosts = Posts?.sort((a: PostType, b: PostType) => {
        if (a.like!.length < b.like!.length) return 1;
        if (a.like!.length > b.like!.length) return -1;
        return 0;
      });
      setUserLikePosts(likePosts);
    };

    const getViewPosts = () => {
      const Posts = [...posts!];

      const viewPosts = Posts?.sort((a: PostType, b: PostType) => {
        if (a.view! < b.view!) return 1;
        if (a.view! > b.view!) return -1;
        return 0;
      });
      setUserViewPosts(viewPosts);
    };
    if (posts) {
      getLikePosts();
      getViewPosts();
    }
  }, [posts]);

  useEffect(() => {
    if (userLike) {
      if (userPosts?.length) {
        const updateUserPoint = async () => {
          await updateDoc(doc(dbService, "Users", "nickname"), {
            point: userLike + userPosts.length * 5,
          });
        };
        updateUserPoint();
      }
    }
  }, [userLike]);

  //더보기 기능
  const [isVisible, setIsVisible] = useState(false);
  const [resArr, setRestArr] = useState(posts.slice(0, 6));
  const [slicenumber, setSliceNumber] = useState(0);

  const handleOnClick = () => {
    setIsVisible(!isVisible);
    if (isVisible) {
      setRestArr(() => [...posts.slice(0, 6)]);
    } else {
      setRestArr(() => [...posts]);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center mb-4 min-h-screen">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <Category setCate={setCate} />
          <div className="w-full mt-12 flex justify-between">
            <div className="text-xl font-bold">
              전체 게시글{" "}
              <span className="float-right ml-2 text-xl font-normal text-primary">
                {cate === "전체"
                  ? posts?.length
                  : posts?.filter((post) => cate === post.type).length}
              </span>
              {/* <span className="float-right ml-2 pt-1 font-base text-base text-[#ff6161]">
                {posts?.length}
              </span> */}
            </div>
          </div>
          {/* <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            {posts?.map((post: any) =>
              cate === "전체" ? (
                <PostCard key={post.postId} post={post} />
              ) : cate === post.type ? (
                <PostCard key={post.postId} post={post} />
              ) : null
            )}
          </div> */}

          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            {cate === "전체"
              ? posts
                  ?.map((post: any) => (
                    <PostCard key={post.postId} post={post} />
                  ))
                  .slice(0, 6 + slicenumber)
              : posts
                  ?.filter((post) => cate === post.type)
                  .map((post: any) => (
                    <PostCard key={post.postId} post={post} />
                  ))
                  .slice(0, 6 + slicenumber)}
            {/* {posts?.length > 6 &&
              posts
                ?.map((post: any) =>
                  cate === "전체" ? (
                    <PostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <PostCard key={post.postId} post={post} />
                  ) : null
                )
                .slice(0, 6 + slicenumber)} */}
          </div>
          {posts.length > slicenumber + 6 ? (
            <button
              className="w-[100px] h-[40px] mt-6 bg-transparent border border-[#FF6161]/50 text-[#FF6161] font-thin hover:bg-[#FFF0F0] hover:border-none rounded-3xl hover:text-[#FF6161] hover:font-bold"
              onClick={() => setSliceNumber(slicenumber + 6)}
            >
              더보기
            </button>
          ) : (
            <button
              className="w-[100px] h-[40px] mt-6 bg-transparent border border-[#FF6161]/50 text-[#FF6161] font-thin hover:bg-[#FFF0F0] hover:border-none rounded-3xl hover:text-[#FF6161] hover:font-bold"
              onClick={() => setSliceNumber(0)}
            >
              접기
            </button>
          )}

          <div className="w-full  mt-16 relative z-0">
            <div className="text-xl font-bold mb-3">
              인기 많은 오주
              <span className="text-primary">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div className="group">
              <Swiper
                spaceBetween={24}
                slidesPerView={3}
                scrollbar={{ draggable: true }}
                navigation={{
                  prevEl: navigationPrevRef.current,
                  nextEl: navigationNextRef.current,
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                  },
                }}
                modules={[EffectCoverflow, Navigation, Mousewheel]}
                grabCursor={true}
                slidesPerGroup={3}
              >
                <div className="">
                  {userLikePosts?.map((post: any) => (
                    <SwiperSlide key={post.postId}>
                      <PostCard key={post.postId} post={post} />
                    </SwiperSlide>
                  ))}{" "}
                </div>
                <div className="">
                  <button
                    ref={navigationPrevRef}
                    className="absolute p-1.5 hidden group-hover:block hover:text-primary hover:bg-second/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer translate-x-[15px] translate-y-[20px] z-20 top-[190px] rounded-full"
                  >
                    <BsChevronLeft size={25} />
                  </button>
                </div>
                <div className="">
                  <button
                    ref={navigationNextRef}
                    className="p-2 absolute hidden group-hover:block hover:text-primary hover:bg-second/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer translate-x-[1140px] translate-y-[-50px] z-20 top-[260px] rounded-full"
                  >
                    <BsChevronRight size={25} />
                  </button>
                </div>
              </Swiper>
            </div>
          </div>

          <div className="w-full mt-[90px] relative z-0 overflow-hidden">
            <div className="text-xl font-bold mb-3">
              많이 본 오주
              <span className="text-primary">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div className="group overflow-visible">
              <Swiper
                spaceBetween={24}
                slidesPerView={3}
                scrollbar={{ draggable: true }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                  },
                }}
                modules={[EffectCoverflow, Navigation, Mousewheel]}
                grabCursor={true}
                slidesPerGroup={3}
              >
                <div>
                  {userViewPosts?.map((post: any) => (
                    <SwiperSlide key={post.postId}>
                      <PostCard key={post.postId} post={post} />
                    </SwiperSlide>
                  ))}{" "}
                </div>
                <div>
                  <button
                    ref={prevRef}
                    className="absolute p-1.5 hidden group-hover:block hover:text-primary hover:bg-second/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer translate-x-[20px] translate-y-[-10px] z-20 top-[210px] rounded-full"
                  >
                    <BsChevronLeft size={25} />
                  </button>
                </div>
                <div>
                  <button
                    ref={nextRef}
                    className="absolute p-2 hidden group-hover:block hover:text-primary hover:bg-second/70 w-[40px] h-[40px] bg-black/20 text-white cursor-pointer translate-x-[1140px] translate-y-[-100px] z-20 top-[300px] rounded-full"
                  >
                    <BsChevronRight size={25} />
                  </button>
                </div>
              </Swiper>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
