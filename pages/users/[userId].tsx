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
import FollowModal from "@/components/follow_modal";
import UserCateNavbar from "@/components/navbar/user_cate_navbar";

const UserPage = () => {
  const userId = window.location.pathname.substring(7);

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

  const [dropOnOff, setDropOnOff] = useState(false);
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false);

  const onClickFollowUpdate = async () => {
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
    const snapshotdata = await snapshot.data();
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
    getMyProfile();
    getUserPosts();
  }, []);
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
              {userProfile?.follower.includes(authService.currentUser?.uid) ? (
                <button
                  onClick={onClickFollowUpdate}
                  className="mt-4 w-[98px] h-[30px] rounded-[50px] bg-[#FFF0f0] text-sm text-[#ff6161] flex justify-center items-center"
                >
                  팔로우
                </button>
              ) : (
                <button
                  onClick={onClickFollowUpdate}
                  className="mt-4 w-[98px] h-[30px] rounded-[50px] bg-[#FF6161] text-sm text-white  flex justify-center items-center"
                >
                  팔로우
                </button>
              )}
            </div>
            <div className="flex flex-col justify-start w-[452px]">
              <div className="w-[440px] flex justify-between">
                <div>
                  <div className="font-bold text-[24px] flex justify-start items-center gap-1">
                    <span>{userProfile?.nickname}</span>
                    <span>
                      <Grade score={userLike! + userPosts?.length! * 5} />
                    </span>
                  </div>
                </div>
                <div className="w-72 flex justify-between items-center mt-1">
                  <div className="flex flex-col justify-center items-center">
                    좋아요<div className="font-bold">{userLike}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />
                  <div className="flex flex-col justify-center items-center">
                    게시글<div className="font-bold">{userPosts?.length}</div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />

                  <div
                    onClick={() => {
                      setIsOpenFollowModal(true);
                      setFollow("follower");
                    }}
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    팔로워
                    <div className="font-bold">
                      {userProfile?.follower.length}
                    </div>
                  </div>
                  <div className="h-8 border-[1px] border-[#c9c5c5]" />

                  <div
                    onClick={() => {
                      setIsOpenFollowModal(true);
                      setFollow("following");
                    }}
                    className="flex flex-col justify-center items-center"
                  >
                    팔로잉
                    <div className="font-bold">
                      {userProfile?.following.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[70px] w-full whitespace-pre-wrap overflow-hidden  mt-7">
                {userProfile?.introduce}
              </div>
            </div>
          </div>
          <UserCateNavbar setCate={setCate} />
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

          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
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
      </div>
    </Layout>
  );
};

export default UserPage;
