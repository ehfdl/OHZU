import Layout from "@/components/layout";
import React from "react";

import "tailwindcss/tailwind.css";
import Banner from "@/components/main_page/banner";
import PostList from "@/components/main_page/post_list";

const Home = () => {
  return (
    <Layout>
      <Banner />
      <PostList />
    </Layout>
  );
};

export default Home;
