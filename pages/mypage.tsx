import Layout from "@/components/layout";
import Cate_Navbar from "@/components/navbar/cate_navbar";
import Ohju_Navbar from "@/components/navbar/ohju_navbar";
import ProfileModal from "@/components/sub_page/profile_modal";
import React, { useEffect, useState } from "react";
import { authService, dbService } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import FollowModal from "@/components/follow_modal";
import MyPostCard from "@/components/sub_page/my_post_card";
import { BiInfoCircle } from "react-icons/bi";
import RankInformationModal from "@/components/sub_page/membership_grade_information";

const Mypage = () => {
  const [myProfile, setMyProfile] = useState<any>();
  const [myPosts, setMyPosts] = useState<PostType[]>();
  const [likePosts, setLikePosts] = useState<PostType[]>();
  const [recentlyPosts, setRecentlyPosts] = useState<PostType[]>();

  const [myLike, setMyLike] = useState<number>();

  const [ohju, setOhju] = useState("my-ohju");
  const [cate, setCate] = useState("전체");

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false);
  const [isOpenFollowingModal, setIsOpenFollowingModal] = useState(false);
  const [isOpenInforModal, setIsOpenInforModal] = useState(false);

  useEffect(() => {
    const getMyProfile = async () => {
      const snapshot = await getDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string)
      );
      const snapshotdata = await snapshot.data();
      const newProfile = {
        ...snapshotdata,
      };
      setMyProfile(newProfile);
    };

    const getMyPosts = () => {
      const q = query(
        collection(dbService, "Posts"),
        where("userId", "==", authService.currentUser?.uid as string),
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
        setMyPosts(newMyPosts);
      });
    };

    const getLikePosts = () => {
      const q = query(
        collection(dbService, "Posts"),
        where("like", "array-contains", authService.currentUser?.uid as string),
        orderBy("createdAt", "desc")
      );

      onSnapshot(q, (snapshot) => {
        const newLikePosts = snapshot.docs.map((doc) => {
          const newLikePost: PostType = {
            postId: doc.id,
            ...doc.data(),
          };
          return newLikePost;
        });
        setLikePosts(newLikePosts);
      });
    };

    getMyProfile();
    getMyPosts();
    getLikePosts();
  }, []);

  useEffect(() => {
    const getRecentlyPosts = () => {
      const recentlyArray = myProfile?.recently;
      const ohjuRecentlyPosts = new Array();
      if (recentlyArray) {
        const q = query(
          collection(dbService, "Posts"),
          where("createdAt", "in", recentlyArray)
        );

        onSnapshot(q, (snapshot) => {
          const newLikePosts = snapshot.docs.map((doc) => {
            const newLikePost: PostType = {
              postId: doc.id,
              ...doc.data(),
            };
            return newLikePost;
          });

          recentlyArray.map((id: any) =>
            newLikePosts?.map((post) =>
              post.createdAt === id ? ohjuRecentlyPosts.push(post) : null
            )
          );
          setRecentlyPosts(ohjuRecentlyPosts);
        });
      }
    };
    if (myProfile) {
      getRecentlyPosts();
    }
  }, [myProfile]);

  useEffect(() => {
    const getMyProfile = async () => {
      const snapshot = await getDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string)
      );
      const snapshotdata = await snapshot.data();
      const newProfile = {
        ...snapshotdata,
      };

      setMyProfile(newProfile);
    };
    getMyProfile();
  }, [isOpenProfileModal]);

  useEffect(() => {
    const totalLike = myPosts?.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.like!.length;
    }, 0);
    setMyLike(totalLike);
  }, [myPosts]);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4 min-h-screen">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-[70px] w-[696px] flex gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full h-40 w-40 overflow-hidden">
                <img
                  src={myProfile?.imageURL as string}
                  className="w-40 aspect-square object-cover"
                />
              </div>
              <button
                className="mt-4 "
                onClick={() => setIsOpenProfileModal(true)}
              >
                프로필 편집
              </button>
            </div>
            <div className="flex flex-col">
              <div className="w-[440px] flex justify-between">
                <div>
                  <div className="font-bold text-[24px]">
                    {myProfile?.nickname}
                  </div>
                  <div className="text-[20px] flex">
                    <span>999잔</span>
                    <span className="ml-1 mt-[6px]">
                      <BiInfoCircle
                        onMouseOver={() => setIsOpenInforModal(true)}
                        onMouseOut={() => setIsOpenInforModal(false)}
                        className="w-[20px] aspect-auto text-[#999999]"
                      />
                    </span>
                  </div>
                  {isOpenInforModal ? <RankInformationModal /> : null}
                </div>
                <div className="w-72 flex justify-between items-center mt-1">
                  <div className="flex flex-col justify-center items-center">
                    좋아요<div>{myLike}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />
                  <div className="flex flex-col justify-center items-center">
                    게시글<div>{myPosts?.length}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />
                  <div
                    onClick={() => setIsOpenFollowModal(true)}
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
              <div className="h-[70px] w-[478px] overflow-hidden mt-5 whitespace-pre-wrap ">
                {myProfile?.introduce}
              </div>
            </div>
          </div>
          <Ohju_Navbar setOhju={setOhju} />
          <Cate_Navbar setCate={setCate} />

          <div className="w-full mt-12 ml-[3px] text-[20px] font-bold">
            게시글{" "}
            <span className="text-[#ff6161]">
              {ohju === "my-ohju"
                ? cate === "전체"
                  ? myPosts?.length
                  : myPosts?.filter((post) => cate === post.type).length
                : ohju === "like-ohju"
                ? cate === "전체"
                  ? likePosts?.length
                  : likePosts?.filter((post) => cate === post.type).length
                : ohju === "recently-ohju"
                ? cate === "전체"
                  ? recentlyPosts?.length
                  : recentlyPosts?.filter((post) => cate === post.type).length
                : null}
            </span>
          </div>
          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            {ohju === "my-ohju"
              ? myPosts?.map((post) =>
                  cate === "전체" ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : null
                )
              : ohju === "like-ohju"
              ? likePosts?.map((post) =>
                  cate === "전체" ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : null
                )
              : ohju === "recently-ohju"
              ? recentlyPosts?.map((post) =>
                  cate === "전체" ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : cate === post.type ? (
                    <MyPostCard key={post.postId} post={post} />
                  ) : null
                )
              : null}
          </div>
        </div>
        {isOpenProfileModal ? (
          <ProfileModal
            setIsOpenProfileModal={setIsOpenProfileModal}
            myProfile={myProfile}
          />
        ) : null}
        {isOpenFollowModal ? (
          <FollowModal setIsOpenFollowModal={setIsOpenFollowModal} />
        ) : null}
      </div>
    </Layout>
  );
};

export default Mypage;
