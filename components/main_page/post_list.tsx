import PostCard from "./post_card";
import { dbService } from "@/firebase";
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
import React, { useEffect, useState, useRef } from "react";
import Category from "./category";
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

  return (
    <div>
      <div className="sm:w-full flex flex-col justify-center items-center sm:mb-3 sm:min-h-screen">
        <Category setCate={setCate} />
        <div className="sm:w-[1200px] w-full flex flex-col justify-start items-center px-4">
          <div className="w-full sm:mt-12 mt-4 mb-4 flex justify-between sm:mb-6">
            <div className="sm:text-xl text-sm font-bold">
              게시물{" "}
              <span className="float-right ml-2 sm:text-xl text-sm font-bold text-primary">
                {cate === "전체"
                  ? posts?.length
                  : posts?.filter((post) => cate === post.type).length}
              </span>
            </div>
          </div>

          <div className="w-full gap-4 bg-white grid grid-cols-2  sm:grid sm:grid-cols-3 sm:gap-6">
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
          </div>
          {posts.length > slicenumber + 6 ? (
            <button
              className="sm:w-[120px] w-[348px] h-[50px] sm:h-[48px] mt-0 sm:mt-1 bg-transparent border border-primary text-primary hover:bg-second hover:border-none rounded-full hover:text-primary hover:font-bold"
              onClick={() => setSliceNumber(slicenumber + 6)}
            >
              더보기
            </button>
          ) : (
            <button
              className="sm:w-[120px] w-[348px] h-[50px] sm:h-[48px] mt-0 sm:mt-1 bg-transparent border border-primary text-primary font-thin hover:bg-second hover:border-none rounded-3xl hover:text-primary hover:font-bold"
              onClick={() => setSliceNumber(0)}
            >
              접기
            </button>
          )}

          <div className="w-full mt-12 sm:mt-16 relative z-0">
            <div className="sm:text-2xl text-xl font-bold mb-5 ml-3 sm:mb-3">
              인기 많은 OHZU
              <span className="text-primary">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div className="group">
              <Swiper
                spaceBetween={160}
                slidesPerView={3}
                scrollbar={{ draggable: true }}
                navigation={{
                  prevEl: navigationPrevRef.current,
                  nextEl: navigationNextRef.current,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 3,
                    spaceBetween: 130,
                    slidesPerGroup: 2,
                  },
                  500: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    slidesPerGroup: 3,
                  },
                }}
                modules={[EffectCoverflow, Navigation, Mousewheel]}
                grabCursor={true}
                slidesPerGroup={2}
              >
                <div className="">
                  {userLikePosts?.map((post: any) => (
                    <SwiperSlide key={post.postId}>
                      <PostCard key={post.postId} post={post} type="like" />
                    </SwiperSlide>
                  ))}{" "}
                </div>
                <div className="">
                  <button
                    ref={navigationPrevRef}
                    className="w-[30px] h-[30px] translate-x-[4px] -translate-y-[70px] top-1/2 absolute p-1.5 hidden sm:group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] bg-black/20 text-white cursor-pointer sm:translate-x-[15px] sm:translate-y-[-30px] z-20 sm:top-[190px] rounded-full"
                  >
                    <BsChevronLeft
                      size={20}
                      className="relative right-[2px] bottom-[1px] sm:right-[-3px] sm:bottom-0"
                    />
                  </button>
                </div>
                <div className="">
                  <button
                    ref={navigationNextRef}
                    className="w-[30px] h-[30px] translate-x-[340px] -translate-y-[70px] top-1/2 p-2 absolute hidden sm:group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] bg-black/20 text-white cursor-pointer sm:translate-x-[1110px] sm:translate-y-[-95px] z-20 sm:top-[260px] rounded-full"
                  >
                    <BsChevronRight
                      size={20}
                      className="relative right-[1px] bottom-[3px] sm:right-[-4px] sm:bottom-0"
                    />
                  </button>
                </div>
              </Swiper>
            </div>
          </div>

          <div className="w-full mt-10 sm:mt-[90px] relative z-0 overflow-hidden">
            <div className="sm:text-2xl text-xl font-bold mb-5 ml-3 sm:mb-3">
              많이 본 OHZU
              <span className="text-primary">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div className="group overflow-visible">
              <Swiper
                spaceBetween={160}
                slidesPerView={3}
                scrollbar={{ draggable: true }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 3,
                    spaceBetween: 130,
                    slidesPerGroup: 2,
                  },
                  500: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    slidesPerGroup: 3,
                  },
                }}
                modules={[EffectCoverflow, Navigation, Mousewheel]}
                grabCursor={true}
                slidesPerGroup={2}
              >
                <div>
                  {userViewPosts?.map((post: any) => (
                    <SwiperSlide key={post.postId}>
                      <PostCard key={post.postId} post={post} type="like" />
                    </SwiperSlide>
                  ))}{" "}
                </div>
                <div>
                  <button
                    ref={prevRef}
                    className="hidden w-[30px] h-[30px] translate-x-[4px] -translate-y-[70px] top-1/2 absolute p-1.5 sm:group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] bg-black/20 text-white cursor-pointer sm:translate-x-[20px] sm:translate-y-[-30px] z-20 sm:top-[210px] rounded-full"
                  >
                    <BsChevronLeft
                      size={20}
                      className="relative sm:right-[-3px] sm:bottom-0 right-[2px] bottom-[1px]"
                    />
                  </button>
                </div>
                <div>
                  <button
                    ref={nextRef}
                    className="w-[30px] h-[30px] translate-x-[340px] -translate-y-[70px] top-1/2 absolute p-2 hidden sm:group-hover:block hover:text-primary hover:bg-second/70 sm:w-[40px] sm:h-[40px] bg-black/20 text-white cursor-pointer sm:translate-x-[1110px] sm:translate-y-[-115px] z-20 sm:top-[300px] rounded-full"
                  >
                    <BsChevronRight
                      size={20}
                      className="relative sm:right-[-4px] sm:bottom-0 right-[1px] bottom-[3px]"
                    />
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
