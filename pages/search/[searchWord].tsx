import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Category from "@/components/main_page/Category";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { authService, dbService } from "@/firebase";
import { GetServerSideProps } from "next";
import Fuse from "fuse.js";
import { async } from "@firebase/util";
import Link from "next/link";
import { SearchCard } from "@/components/search_card";

interface PropsType {
  searchWord: string;
}

export default function Searchwords() {
  const router = useRouter();

  const searchWord = decodeURI(window.location.pathname.substring(8));
  // console.log("검색창 키워드 디코드 searchWord : ", searchWord);

  const [cate, setCate] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchData, setSearchData]: any = useState();

  // DB Posts 전체 데이터 조회
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

  // const arr = posts[0].ingredient;

  // 검색
  const getSearch = () => {
    // const arr = posts[0].ingredient?.includes(searchWord)
    const postsData = new Fuse(posts, {
      keys: ["title", "ingredient"],
    });
    const result = postsData.search(searchWord);
    setSearchData(result);
  };

  useEffect(() => {
    getSearch();
  }, [searchWord]);

  useEffect(() => {
    getSearch();
  }, [posts]);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] w-full m-auto ">
        <h1 className="mt-20 mb-11 text-[40px] font-bold">
          {searchWord ? searchWord : " - "}{" "}
          <span className="text-[#8E8E93]">검색결과</span>
        </h1>
        <div className=" w-full flex justify-center mb-12">
          <Category setCate={setCate} />
        </div>
        <div className="max-w-[1200px] m-auto min-h-screen ">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px] font-semibold">
              게시글{" "}
              <span className="text-[#FF6161]">{searchData?.length}</span>
            </p>
            <Dropdown />
          </div>
          <div className="card-wrap flex grid grid-cols-3 gap-6 justify-between">
            {searchData?.map((card: any) => (
              <SearchCard key={card.item.postId} card={card} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({
//   params: { searchWord },
// }: any) => {
//   return {
//     props: { searchWord },
//   };
// };
