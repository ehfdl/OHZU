import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Category from "@/components/main_page/category";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { authService, dbService } from "@/firebase";
import Fuse from "fuse.js";
import { SearchCard } from "@/components/search_card";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout";

export default function Searchwords({ searchWord }: { searchWord: string }) {
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchData, setSearchData]: any = useState();
  const [searchDataLike, setSearchDataLike] = useState<any>();
  const [searchDataView, setSearchDataView] = useState<any>([]);

  const [drop, setDrop] = useState("최신순");
  const [cate, setCate] = useState("전체");

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
  // DB Posts 전체 데이터 조회

  // 검색
  const getSearch = () => {
    const postsData = new Fuse(posts, {
      keys: ["title", "ingredient"],
    });
    const result = postsData.search(searchWord);
    setSearchData(result);
  };

  const getLikeSearch = () => {
    const changePosts = [...searchData];
    const searchLikeData = changePosts?.sort((a: any, b: any) => {
      if (a.item.like!.length < b.item.like!.length) return 1;
      if (a.item.like!.length > b.item.like!.length) return -1;
      return 0;
    });
    setSearchDataLike(searchLikeData);
  };
  const getViewSearch = () => {
    const changePosts = [...searchData];
    const searchViewData = changePosts?.sort((a: any, b: any) => {
      if (a.item.view < b.item.view) return 1;
      if (a.item.view > b.item.view) return -1;
      return 0;
    });
    setSearchDataView(searchViewData);
  };

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
  useEffect(() => {
    getSearch();
  }, [searchWord]);

  useEffect(() => {
    getSearch();
  }, [posts]);
  useEffect(() => {
    if (searchData) {
      getLikeSearch();
      getViewSearch();
    }
  }, [searchData]);

  return (
    <Layout>
      <div className="max-w-[1200px] w-full m-auto ">
        <h1 className="mt-20 mb-11 text-[40px] font-bold">
          {searchWord ? `'${searchWord}' ` : " '-' "}{" "}
          <span className="text-textGray">&nbsp;검색 결과</span>
        </h1>
        <div className=" w-full flex justify-center mb-12">
          <Category setCate={setCate} />
        </div>
        <div className="max-w-[1200px] m-auto min-h-screen ">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px] font-semibold">
              게시글 <span className="text-primary">{searchData?.length}</span>
            </p>
            <Dropdown setDrop={setDrop} drop={drop} />
          </div>
          <div className="card-wrap grid grid-cols-3 gap-6 justify-between">
            {drop === "최신순"
              ? searchData?.map((card: any) =>
                  // 카테고리 정렬
                  cate === "전체" ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : cate === card.item.type ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : null
                )
              : drop === "인기순"
              ? searchDataLike?.map((card: any) =>
                  cate === "전체" ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : cate === card.item.type ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : null
                )
              : searchDataView?.map((card: any) =>
                  cate === "전체" ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : cate === card.item.type ? (
                    <SearchCard key={card.item.postId} card={card} />
                  ) : null
                )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async ({
  params: { searchWord },
}: any) => {
  return {
    props: { searchWord },
  };
};
