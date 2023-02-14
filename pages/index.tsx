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
import { dbService } from "@/firebase";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import Banner from "@/components/main_page/Banner";
import Category from "@/components/main_page/Category";
import AllList from "@/components/main_page/AllList";
import NewList from "@/components/main_page/NewList";
import PopularList from "@/components/main_page/PopularList";
import MostWatchedList from "@/components/main_page/MostWatchedList";
import TopButton from "@/components/TopButton";
import WriteButton from "@/components/WriteButton";

const Home = () => {
  return (
    <Layout>
      <div className="w-1920 h-3000 justify-center items-stretch mt-7 mb-4 ml-96 mr-96 p-3">
        <Banner />
        <Category />
        <AllList />

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
