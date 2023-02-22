import Layout from "@/components/layout";
import React from "react";
import MainBanner from "@/components/main_page/banner";
import "tailwindcss/tailwind.css";
import PostList from "@/components/main_page/post_list";

const Home = () => {
  return (
    <Layout>
      <MainBanner />
      <PostList />
    </Layout>
  );
};

export default Home;
