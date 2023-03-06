import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import MainBanner from "@/components/main_page/banner";
import "tailwindcss/tailwind.css";
import PostList from "@/components/main_page/post_list";
import { authService } from "@/firebase";
import LandingPage from "@/components/landing/landing_page";

const Home = () => {
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

  return (
    <>
      <LandingPage />
      <Layout>
        <MainBanner />
        <PostList />
      </Layout>
    </>
  );
};

export default Home;
