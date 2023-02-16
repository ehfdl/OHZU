import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { dbService, authService } from "@/firebase";
import "tailwindcss/tailwind.css";
import Banner from "@/components/main_page/banner";
import Category from "@/components/main_page/Category";
import PostList from "@/components/main_page/post_list";

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [user, setUser] = useState<UserType[]>([]);

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

  const getUsers = async () => {
    const snapshot = await getDoc(doc(dbService, "Users", "nickname"));
    const users = snapshot.data(); // 가져온 doc의 객체 내용
    setUser(user);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="sm:max-w-[1200px] mx-auto justify-center items-center mt-7 mb-4">
        <Banner />
        <Category />
        <p className="float-left font-bold text-xl">전체 게시글</p>
        <span className="float-left ml-2 pt-0.5 font-base text-base text-gray-400">
          300
        </span>
        <PostList posts={posts} user={user} />

        {/* 좋아요 많이 받은 오주 목록 */}
        <div className="mt-16">
          <p className="float-left font-bold text-xl">인기 많은 오주</p>
          <PostList posts={posts} user={user} />
        </div>

        {/* 조회수 많은 오주 목록 */}
        <div className="mt-16">
          <p className="float-left font-bold text-xl">많이 본 오주</p>
          <PostList posts={posts} user={user} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
