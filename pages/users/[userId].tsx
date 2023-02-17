import Layout from "@/components/layout";
import UserPostCard from "@/components/sub_page/user_post_card";
import Cate_Navbar from "@/components/navbar/cate_navbar";
import { dbService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import UserDropdown from "@/components/sub_page/user_dropdown";

const UserPage = () => {
  const userId = window.location.pathname.substring(7);

  const [userProfile, setUserProfile] = useState<any>();
  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [userLikePosts, setUserLikePosts] = useState<PostType[]>();
  const [userViewPosts, setUserViewPosts] = useState<PostType[]>();
  const [userLike, setUserLike] = useState<number>();

  const [cate, setCate] = useState("전체");
  const [cateDrop, setCateDrop] = useState("최신순");

  const [dropOnOff, setDropOnOff] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const snapshot = await getDoc(doc(dbService, "Users", userId));
      const snapshotdata = await snapshot.data();
      const newProfile = {
        ...snapshotdata,
      };

      const q = query(
        collection(dbService, "Posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      onSnapshot(q, (snapshot) => {
        const newUserPosts = snapshot.docs.map((doc) => {
          const newUserPost: PostType = {
            postId: doc.id,
            ...doc.data(),
          };
          return newUserPost;
        });
        setUserPosts(newUserPosts);
      });

      setUserProfile(newProfile);
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    const totalLike = userPosts?.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.like!.length;
    }, 0);
    setUserLike(totalLike);

    const getLikePosts = () => {
      const Posts = [...userPosts!];
      const likePosts = Posts?.sort((a: PostType, b: PostType) => {
        if (a.like!.length < b.like!.length) return 1;
        if (a.like!.length > b.like!.length) return -1;
        return 0;
      });
      setUserLikePosts(likePosts);
    };

    const getViewPosts = () => {
      const Posts = [...userPosts!];

      const viewPosts = Posts?.sort((a: PostType, b: PostType) => {
        if (a.view! < b.view!) return 1;
        if (a.view! > b.view!) return -1;
        return 0;
      });
      setUserViewPosts(viewPosts);
    };
    if (userPosts) {
      getLikePosts();
      getViewPosts();
    }
  }, [userPosts]);

  useEffect(() => {
    setDropOnOff(false);
  }, [cateDrop]);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4 min-h-screen">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-[70px] w-[670px] flex gap-[60px] mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full h-[124px] w-[124px] overflow-hidden">
                <img
                  src={userProfile?.imageURL as string}
                  className="w-[124px] aspect-square object-cover"
                />
              </div>
              <button className="mt-4 w-[98px] h-[30px] rounded-[50px] bg-[#FF6161] text-sm text-white flex justify-center items-center">
                팔로우
              </button>
            </div>
            <div className="flex flex-col justify-start w-[452px]">
              <div className="w-[440px] flex justify-between">
                <div>
                  <div className="font-bold text-[24px]">
                    {userProfile?.nickname} 🍺
                  </div>
                </div>
                <div className="w-72 flex justify-between items-center mt-1">
                  <div className="flex flex-col justify-center items-center">
                    좋아요<div>{userLike}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />
                  <div className="flex flex-col justify-center items-center">
                    게시글<div>{userPosts?.length}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />

                  <div
                    // onClick={() => setIsOpenFollowModal(true)}
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    팔로워<div>27</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />

                  <div className="flex flex-col justify-center items-center">
                    팔로잉<div>27</div>
                  </div>
                </div>
              </div>
              <div className="h-[70px] w-full whitespace-pre-wrap overflow-hidden  mt-7">
                {userProfile?.introduce}
              </div>
            </div>
          </div>
          <Cate_Navbar setCate={setCate} />
          <div className="w-full mt-12 flex justify-between">
            <div className="ml-[3px] text-[20px] font-bold">
              게시글{" "}
              <span className="text-[#ff6161]">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div>
              <div
                onClick={() => setDropOnOff(!dropOnOff)}
                className="w-[111px] h-[33px] text-[#828293] flex justify-center items-center cursor-pointer"
              >
                {cateDrop}
                {dropOnOff ? (
                  <img src="/arrow/up-arrow.png" className="absolute ml-20" />
                ) : (
                  <img src="/arrow/down-arrow.png" className="absolute ml-20" />
                )}
              </div>
              {dropOnOff ? (
                <UserDropdown setCateDrop={setCateDrop} cateDrop={cateDrop} />
              ) : null}
            </div>
          </div>

          <div className="w-full mt-4 bg-white grid grid-cols-2 gap-6">
            {cateDrop === "최신순"
              ? userPosts?.map((post) =>
                  cate === "전체" ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : null
                )
              : cateDrop === "인기순"
              ? userLikePosts?.map((post) =>
                  cate === "전체" ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : null
                )
              : cateDrop === "조회순"
              ? userViewPosts?.map((post) =>
                  cate === "전체" ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <UserPostCard key={post.postId} post={post} />
                  ) : null
                )
              : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserPage;
