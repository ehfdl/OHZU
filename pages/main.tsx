import Layout from "@/components/layout";
import MainBanner from "@/components/main_page/banner";
import PostList from "@/components/main_page/post_list";
import React from "react";

const Main = () => {
  return (
    <Layout>
      <MainBanner />
      <PostList />
    </Layout>
  );
};

export default Main;
