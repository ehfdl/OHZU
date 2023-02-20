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
  updateDoc,
} from "firebase/firestore";
import { dbService, authService } from "@/firebase";
import "tailwindcss/tailwind.css";
import Banner from "@/components/main_page/banner";
import PostList from "@/components/main_page/post_list";

const Home = () => {
  console.log("authService : ", authService.currentUser?.uid);

  return (
    <Layout>
      <Banner />
      <PostList />
    </Layout>
  );
};

export default Home;
