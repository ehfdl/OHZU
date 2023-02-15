import Layout from "@/components/layout";
import SubPostCard from "@/components/sub_page/my_post";
import Cate_Navbar from "@/components/navbar/cate_navbar";
import { authService, dbService } from "@/firebase";
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
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<any>();
  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [userLike, setUserLike] = useState<number>();

  const [cate, setCate] = useState("전체");

  useEffect(() => {
    const userId = window.location.pathname.substring(7);

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
  }, [userPosts]);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4 min-h-screen">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-[70px] w-[688px] flex gap-11">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full h-40 w-40 overflow-hidden">
                <img
                  src={userProfile?.imageURL as string}
                  className="w-40 aspect-square object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="w-[484px] flex justify-between">
                <div>
                  <div className="font-bold text-[24px]">
                    {userProfile?.nickname} 🍺
                  </div>
                  <div className="text-[20px] ml-1">
                    999잔 <span className="ml-[2px]">ℹ</span>
                  </div>
                </div>
                <div className="w-[264px] flex justify-between">
                  <div className="flex flex-col justify-center items-center">
                    좋아요<div>{userLike}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    게시글<div>{userPosts?.length}</div>
                  </div>
                  <div
                    // onClick={() => setIsOpenFollowModal(true)}
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    팔로워<div>27</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    팔로잉<div>27</div>
                  </div>
                </div>
              </div>
              <pre className="h-14 mt-7 ">{userProfile?.introduce}</pre>
            </div>
          </div>
          <Cate_Navbar setCate={setCate} />
          <div className="w-full mt-12 ml-[3px] text-[20px] font-bold">
            게시글{" "}
            <span className="text-[#c6c6d4]">
              {cate === "전체"
                ? userPosts?.length
                : userPosts?.filter((post) => cate === post.type).length}
            </span>
          </div>
          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            {userPosts?.map((post) =>
              cate === "전체" ? (
                <SubPostCard key={post.postId} post={post} />
              ) : cate === post.type ? (
                <SubPostCard key={post.postId} post={post} />
              ) : null
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserPage;
