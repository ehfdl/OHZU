import Layout from "@/components/layout";
import UserPostCard from "@/components/sub_page/user_post_card";
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
import React, { useEffect, useState } from "react";
import UserDropdown from "@/components/sub_page/user_dropdown";
import Grade from "@/components/grade";
import UserCateNavbar from "@/components/navbar/user_cate_navbar";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import { GetServerSideProps } from "next";
import FollowModal from "@/components/modal/follow_modal";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  console.log(router.query);
  const [sessionId, setSessionId] = useState<string>();
  const userId = (router.query.userId as string) || (sessionId as string);

  useEffect(() => {
    if (typeof window !== undefined) {
      const session_userId = sessionStorage.getItem("USER_ID");
      setSessionId(session_userId as string);
    }
    if (sessionId !== userId) {
      sessionStorage.removeItem("USER_ID");
      sessionStorage.setItem("USER_ID", userId);
    }
  }, []);

  const [myProfile, setMyProfile] = useState<any>();
  const [userProfile, setUserProfile] = useState<any>();
  const [usersFollowerProfile, setUsersFollowerProfile] = useState<any>();
  const [usersFollowingProfile, setUsersFollowingProfile] = useState<any>();

  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [userLikePosts, setUserLikePosts] = useState<PostType[]>();
  const [userViewPosts, setUserViewPosts] = useState<PostType[]>();
  const [userLike, setUserLike] = useState<number>();

  const [cate, setCate] = useState("전체");
  const [cateDrop, setCateDrop] = useState("최신순");
  const [follow, setFollow] = useState("follower");
  const { showModal } = useModal();

  const [dropOnOff, setDropOnOff] = useState(false);
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Firebase 연결되면 화면 표시
      // user === authService.currentUser 와 같은 값
      if (user) {
        setIsLoggedIn(true);
        console.log("로그인");
      } else {
        setIsLoggedIn(false);
        console.log("로그아웃");
      }
    });
  }, []);

  const onClickFollowUpdate = async () => {
    if (!authService.currentUser?.uid) {
      showModal({
        modalType: "ConfirmModal",
        modalProps: {
          title: "로그인 후 이용 가능합니다.",
          text: "로그인 페이지로 이동하시겠어요?",
          rightbtnfunc: () => {
            showModal({
              modalType: "LoginModal",
              modalProps: {},
            });
          },
        },
      });

      return true;
    }
    const FollowerArray = userProfile.follower.includes(
      authService.currentUser?.uid
    );

    if (FollowerArray) {
      const newFollowerArray = userProfile.follower.filter(
        (id: any) => id !== authService.currentUser?.uid
      );
      const newFollowingArray = myProfile.following.filter(
        (id: any) => id !== userId
      );
      await updateDoc(doc(dbService, "Users", userId), {
        follower: newFollowerArray,
      });
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        {
          following: newFollowingArray,
        }
      );
    } else if (!FollowerArray) {
      const newFollowerArray = userProfile.follower.push(
        authService.currentUser?.uid
      );
      const newFollowingArray = myProfile.following.push(userId);
      await updateDoc(doc(dbService, "Users", userId), {
        follower: userProfile.follower,
      });
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        {
          following: myProfile.following,
        }
      );
    }
    getUserProfile();
    getMyProfile();
  };

  const getUserProfile = async () => {
    const snapshot = await getDoc(doc(dbService, "Users", userId));
    const snapshotdata = snapshot.data();
    const newProfile = {
      ...snapshotdata,
    };
    setUserProfile(newProfile);
  };
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

  const getFollowingUsersProfile = async () => {
    if (userProfile) {
      const userArray = new Array();
      const promiseUser = Promise.allSettled(
        userProfile.following.map(async (postId: any) => {
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
    if (userProfile) {
      const userArray = new Array();
      const promiseUser = Promise.allSettled(
        userProfile.follower.map(async (postId: any) => {
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
    if (userId) {
      const getUserPosts = async () => {
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
      };

      getUserProfile();
      getUserPosts();
    }
  }, [userId]);
  useEffect(() => {
    if (authService.currentUser?.uid) {
      getMyProfile();
    }
  }, [authService.currentUser?.uid]);

  useEffect(() => {
    if (userProfile) {
      getFollowerUsersProfile();
      getFollowingUsersProfile();
    }
  }, [userProfile]);

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

  useEffect(() => {
    if (userLike) {
      if (userPosts?.length) {
        const updateUserPoint = async () => {
          await updateDoc(doc(dbService, "Users", userId as string), {
            point: userLike + userPosts.length * 5,
          });
        };
        updateUserPoint();
      }
    }
  }, [userLike]);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4 sm:min-h-screen">
        <div className="max-w-[390px] w-full sm:max-w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-9 sm:mt-[70px] w-full sm:w-[696px] flex sm:gap-12 gap-6 px-6">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full w-16 sm:w-[124px] aspect-square overflow-hidden">
                {userProfile?.imageURL && (
                  <Image
                    src={userProfile?.imageURL as string}
                    className="w-16 sm:w-[124px] aspect-square object-cover"
                    alt=""
                    width={124}
                    height={124}
                  />
                )}
              </div>
              {userProfile?.follower.includes(authService.currentUser?.uid) ? (
                <button
                  aria-label="follow"
                  onClick={onClickFollowUpdate}
                  className="mt-3 sm:mt-4 w-[60px] sm:w-[98px] h-5 sm:h-[30px] rounded-[100px] sm:rounded-[50px] bg-second text-[11px] sm:text-sm text-primary flex justify-center items-center"
                >
                  팔로우
                </button>
              ) : (
                <button
                  aria-label="follow"
                  onClick={onClickFollowUpdate}
                  className="mt-3 sm:mt-4 w-[60px] sm:w-[98px] h-5 sm:h-[30px] rounded-[100px] sm:rounded-[50px] bg-primary text-[11px] sm:text-sm text-white  flex justify-center items-center"
                >
                  팔로우
                </button>
              )}
            </div>
            <div className="flex flex-col mt-1 sm:mt-0 justify-start w-[452px]">
              <div className="w-[238px] sm:w-[440px] sm:flex sm:justify-between">
                <div>
                  <div className="font-bold sm:text-[24px] flex justify-start items-center gap-1">
                    <span>{userProfile?.nickname}</span>
                    <span className="w-3 h-[15px] sm:w-[18px] sm:h-[22px]">
                      <Grade score={userLike! + userPosts?.length! * 5} />
                    </span>
                  </div>
                </div>
                <div className="w-52 sm:w-72 flex justify-between items-center mt-2 sm:mt-1">
                  <div className="text-[11px] sm:text-base flex flex-col justify-center items-center">
                    좋아요<div className="font-bold">{userLike}</div>
                  </div>
                  <div className="h-6 sm:h-8 border-r border-[#c9c5c5]" />
                  <div className="text-[11px] sm:text-base flex flex-col justify-center items-center">
                    게시물<div className="font-bold">{userPosts?.length}</div>
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
                      {userProfile?.follower.length}
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
                      {userProfile?.following.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block h-[50px] sm:h-[70px] text-[12px] sm:text-base w-full whitespace-pre-wrap overflow-hidden mt-3 sm:mt-7">
                {userProfile?.introduce}
              </div>
            </div>
          </div>
          <div className="sm:hidden flex justify-center items-center h-[50px] px-8 sm:h-[70px] text-[12px] w-full whitespace-pre-wrap overflow-hidden mt-3 sm:mt-7">
            {userProfile?.introduce}
          </div>
          <UserCateNavbar setCate={setCate} />
          <div className="w-full mt-5 sm:mt-12 flex justify-between">
            <div className="pl-6 sm:pl-[3px] text-[14px] sm:text-[20px] font-bold">
              게시물{" "}
              <span className="text-primary">
                {cate === "전체"
                  ? userPosts?.length
                  : userPosts?.filter((post) => cate === post.type).length}
              </span>
            </div>
            <div>
              <div
                onClick={() => setDropOnOff(!dropOnOff)}
                className="pr-3 sm:pr-0 pb-3 sm:pb-0 w-[111px] h-[33px] text-[14px] sm:text-base text-[#828293] flex justify-center items-center cursor-pointer"
              >
                {cateDrop}
                {dropOnOff ? (
                  <Image
                    src="/arrow/up-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                ) : (
                  <Image
                    src="/arrow/down-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                )}
              </div>
              {dropOnOff ? (
                <UserDropdown setCateDrop={setCateDrop} cateDrop={cateDrop} />
              ) : null}
            </div>
          </div>

          <div className="w-full px-4 sm:px-0 mt-4 bg-white grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
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

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.userId ? context.query.userId : "";
  return {
    props: { userId },
  };
};
