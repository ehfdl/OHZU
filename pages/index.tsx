import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { dbService, authService } from "@/firebase";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import Banner from "@/components/main_page/banner";
import Category from "@/components/main_page/Category";
import AllList from "@/components/main_page/post_list";
import NewList from "@/components/main_page/new_list";
import PopularList from "@/components/main_page/popular_list";
import MostWatchedList from "@/components/main_page/most_watched_list";
import TopButton from "@/components/top_btn";
import WriteButton from "@/components/write_btn";
import { where } from "firebase/firestore";

const Home = () => {
  const [posts, setPosts] = useState<Form[]>([]);

  useEffect(() => {
    const q = query(collection(dbService, "Posts"));
    onSnapshot(q, (snapshot) => {
      const newMyPosts = snapshot.docs.map((doc) => {
        const newMyPost: any = {
          postId: doc.id,
          ...doc.data(),
        };
        return newMyPost;
      });
      setPosts(newMyPosts);
    });
  }, []);

  return (
    <Layout>
      <div className="w-1920 h-3000 justify-center items-stretch mt-7 mb-4 ml-96 mr-96 p-3">
        <Banner />
        <Category />
        <AllList posts={posts} />

        {/* 최신 오주 목록 */}
        <NewList />

        {/* 좋아요 많이 받은 오주 목록 */}
        <PopularList />

        {/* 조회수 많은 오주 목록 */}
        <MostWatchedList />
        <Link href="/post/write">
          <WriteButton></WriteButton>
        </Link>
        <TopButton />
      </div>
    </Layout>
  );
};

export default Home;
