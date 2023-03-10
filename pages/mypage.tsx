import Layout from "@/components/layout";
import Cate_Navbar from "@/components/navbar/cate_navbar";
import Ohju_Navbar from "@/components/navbar/ohju_navbar";
import React, { useEffect, useMemo, useState } from "react";
import { apiKey, authService, dbService } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import MyPostCard from "@/components/sub_page/my_post_card";
import { BiInfoCircle } from "react-icons/bi";
import RankInformationModal from "@/components/sub_page/membership_grade_information";
import Grade from "@/components/grade";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";
import FollowModal from "@/components/modal/follow_modal";

const Mypage = () => {
  const [myProfile, setMyProfile] = useState<any>();
  const [usersFollowerProfile, setUsersFollowerProfile] = useState<any>();
  const [usersFollowingProfile, setUsersFollowingProfile] = useState<any>();

  const [allPosts, setAllPosts] = useState<PostType[]>();
  const [myPosts, setMyPosts] = useState<PostType[]>();
  const [likePosts, setLikePosts] = useState<PostType[]>();
  const [recentlyPosts, setRecentlyPosts] = useState<PostType[]>();

  const [myLike, setMyLike] = useState<number>();

  const [ohju, setOhju] = useState("my-ohju");
  const [cate, setCate] = useState("전체");
  const [follow, setFollow] = useState("follower");
  //users 불러오기까지함.

  const { modal, showModal } = useModal();
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false);
  const [isOpenInforModal, setIsOpenInforModal] = useState(false);

  const getMyProfile = async () => {
    const is_session = sessionStorage.getItem(apiKey as string);
    const snapshot = await getDoc(
      doc(
        dbService,
        "Users",
        (authService.currentUser?.uid as string) || (is_session as string)
      )
    );
    const snapshotdata = await snapshot.data();
    const newProfile = {
      ...snapshotdata,
    };
    setMyProfile(newProfile);
  };

  const getFollowingUsersProfile = async () => {
    if (myProfile) {
      const userArray = new Array();
      const promiseUser = Promise.allSettled(
        myProfile.following.map(async (postId: any) => {
          const snapshot = await getDoc(doc(dbService, "Users", postId));
          const snapshotdata = await snapshot.data();
          const newProfile = {
            ...snapshotdata,
          };
          return newProfile;
        })
      );
      (await promiseUser).forEach((item: any) => userArray.push(item.value));
      setUsersFollowingProfile(userArray);
    }
  };

  const getFollowerUsersProfile = async () => {
    if (myProfile) {
      const userArray = new Array();
      const promiseUser = Promise.allSettled(
        myProfile.follower.map(async (postId: any) => {
          const snapshot = await getDoc(doc(dbService, "Users", postId));
          const snapshotdata = await snapshot.data();
          const newProfile = {
            ...snapshotdata,
          };
          return newProfile;
        })
      );
      (await promiseUser).forEach((item: any) => userArray.push(item.value));
      setUsersFollowerProfile(userArray);
    }
  };

  useEffect(() => {
    const getAllPosts = async () => {
      const q = query(
        collection(dbService, "Posts"),
        orderBy("createdAt", "desc")
      );

      onSnapshot(q, (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => {
          const newPost: PostType = {
            postId: doc.id,
            ...doc.data(),
          };
          return newPost;
        });
        setAllPosts(newPosts);
      });
    };
    getMyProfile();

    getAllPosts();
  }, []);

  useMemo(() => {
    const ohjuMyPosts = allPosts?.filter(
      (post) => post.userId === authService.currentUser?.uid
    );
    const ohjuLikePosts = allPosts?.filter((post) =>
      post.like?.includes(authService.currentUser?.uid as string)
    );

    setMyPosts(ohjuMyPosts);
    setLikePosts(ohjuLikePosts);
  }, [allPosts]);

  useEffect(() => {
    if (myProfile) {
      const ohjuRecentlyPosts = new Array();
      myProfile?.recently.map((id: any) =>
        allPosts?.map((post) =>
          post.postId === id ? ohjuRecentlyPosts.push(post) : null
        )
      );

      getFollowerUsersProfile();
      getFollowingUsersProfile();
      setRecentlyPosts(ohjuRecentlyPosts);
    }
  }, [myProfile]);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      getMyProfile();
    }
  }, [modal]);

  useEffect(() => {
    const totalLike = myPosts?.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.like!.length;
    }, 0);
    setMyLike(totalLike);
  }, [myPosts]);

  useEffect(() => {
    if (myLike) {
      if (myPosts?.length) {
        const updateUserPoint = async () => {
          await updateDoc(
            doc(dbService, "Users", authService.currentUser?.uid as string),
            { point: myLike + myPosts.length * 5 }
          );
        };
        updateUserPoint();
      }
    }
  }, [myLike]);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4 sm:min-h-screen">
        <div className="max-w-[390px] w-full sm:max-w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-9 sm:mt-[70px] w-full sm:w-[696px] justify-between flex sm:gap-12 gap-6 px-6">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full w-16 sm:w-40 aspect-square overflow-hidden">
                {myProfile?.imageURL && (
                  <Image
                    src={myProfile?.imageURL as string}
                    className="w-16 sm:w-40 aspect-square object-cover"
                    alt=""
                    width={160}
                    height={160}
                  />
                )}
              </div>
              <button
                aria-label="edit-profile"
                className="sm:mt-4 mt-2 sm:text-base text-[12px]"
                onClick={() =>
                  showModal({
                    modalType: "ProfileModal",
                    modalProps: { myProfile: myProfile, myPosts: myPosts },
                  })
                }
              >
                프로필 설정
              </button>
            </div>
            <div className="flex flex-col">
              <div className="w-[238px] sm:w-[440px] sm:flex sm:justify-between">
                <div>
                  <div className="font-bold sm:text-[24px] flex justify-start items-center gap-1">
                    <span>{myProfile?.nickname}</span>
                    <span className="w-3 h-[15px] sm:w-[18px] sm:h-[22px]">
                      <Grade score={myLike! + myPosts?.length! * 5} />
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-[20px] flex">
                    <span>{myLike! + myPosts?.length! * 5}잔</span>
                    <span className="ml-1 mt-1 sm:mt-[6px]">
                      <BiInfoCircle
                        onMouseOver={() => setIsOpenInforModal(true)}
                        onMouseOut={() => setIsOpenInforModal(false)}
                        className="hidden sm:block w-[18px] sm:w-5 aspect-square text-[#999999]"
                      />
                      <BiInfoCircle
                        onClick={() => setIsOpenInforModal(true)}
                        className="sm:hidden w-[18px] sm:w-5 aspect-square text-[#999999]"
                      />
                    </span>
                  </div>
                  {isOpenInforModal ? (
                    <RankInformationModal
                      setIsOpenInforModal={setIsOpenInforModal}
                    />
                  ) : null}
                </div>
                <div className="w-52 sm:w-72 flex justify-between items-center mt-2 sm:mt-1">
                  <div className="text-[11px] sm:text-base flex flex-col justify-center items-center">
                    좋아요<div className="font-bold">{myLike}</div>
                  </div>
                  <div className="h-6 sm:h-8 border-r border-[#c9c5c5]" />
                  <div className="text-[11px] sm:text-base flex flex-col justify-center items-center">
                    게시물<div className="font-bold">{myPosts?.length}</div>
                  </div>
                  <div className="h-6 sm:h-8 border-r border-[#c9c5c5]" />
                  <div
                    onClick={() => {
                      setIsOpenFollowModal(true);
                      setFollow("follower");
                    }}
                    className="text-[11px] sm:text-base flex flex-col justify-center items-center cursor-pointer"
                  >
                    팔로워
                    <div className="font-bold">
                      {myProfile?.follower.length}
                    </div>
                  </div>
                  <div className="h-6 sm:h-8 border-r border-[#c9c5c5]" />
                  <div
                    onClick={() => {
                      setIsOpenFollowModal(true);
                      setFollow("following");
                    }}
                    className="text-[11px] sm:text-base flex flex-col justify-center items-center cursor-pointer"
                  >
                    팔로잉
                    <div className="font-bold">
                      {myProfile?.following.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block text-[12px] sm:text-base h-[52px] sm:h-[70px] w-[238px] sm:w-[478px] overflow-hidden mt-3 sm:mt-5 whitespace-pre-wrap ">
                {myProfile?.introduce}
              </div>
            </div>
          </div>
          <div className="sm:hidden flex justify-center items-center h-[50px] px-8 sm:h-[70px] text-[12px] w-full whitespace-pre-wrap overflow-hidden mt-3 sm:mt-7">
            {myProfile?.introduce}
          </div>
          <Ohju_Navbar setOhju={setOhju} setCate={setCate} />
          <Cate_Navbar setCate={setCate} cate={cate} />

          <div className="w-full mt-5 sm:mt-12 pl-6 sm:pl-[3px] text-[14px] sm:text-[20px] font-bold">
            게시물{" "}
            <span className="text-primary">
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
          <div className="w-full min-h-[calc(100vh-650px)] mt-4 px-4 sm:px-0 bg-white grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
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
      </div>
      {isOpenFollowModal ? (
        <FollowModal
          setIsOpenFollowModal={setIsOpenFollowModal}
          follow={follow}
          setFollow={setFollow}
          usersFollowerProfile={usersFollowerProfile}
          usersFollowingProfile={usersFollowingProfile}
          myProfile={myProfile}
          getMyProfile={getMyProfile}
        />
      ) : null}
    </Layout>
  );
};

export default Mypage;
