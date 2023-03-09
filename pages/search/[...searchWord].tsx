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
import Image from "next/image";
import UserDropdown from "@/components/sub_page/user_dropdown";
import UserCateNavbar from "@/components/navbar/user_cate_navbar";

export default function Searchwords({ searchWord }: { searchWord: string }) {
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchData, setSearchData]: any = useState();
  const [searchDataLike, setSearchDataLike] = useState<any>();
  const [searchDataView, setSearchDataView] = useState<any>([]);

  const [drop, setDrop] = useState("최신순");
  const [cate, setCate] = useState("전체");
  const [dropOnOff, setDropOnOff] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Firebase 연결되면 화면 표시
      // user === authService.currentUser 와 같은 값
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  // DB Posts 전체 데이터 조회

  // 검색
  const getSearch = () => {
    const postsData = new Fuse(posts, {
      threshold: 0.2,
      distance: 100,
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
      {/* 웹 */}
      <div className="sm:block max-w-[1200px] w-full m-auto ">
        <h1 className="mt-20 mb-11 text-[40px] font-bold">
          {searchWord ? `'${searchWord}' ` : " '-' "}{" "}
          <span className="text-textGray">&nbsp;검색 결과</span>
        </h1>
        <div className="w-full flex justify-center mb-12">
          <UserCateNavbar setCate={setCate} />
        </div>
        <div className="max-w-[1200px] m-auto min-h-screen">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px] font-semibold">
              게시물{" "}
              <span className="text-primary">
                {cate === "전체"
                  ? searchData?.length
                  : searchData?.filter((post: any) => cate === post.item.type)
                      .length}
              </span>
            </p>
            {/* <Dropdown setDrop={setDrop} drop={drop} /> */}
            <div>
              <div
                onClick={() => setDropOnOff(!dropOnOff)}
                className="pr-3 sm:pr-0 pb-3 sm:pb-0 w-[111px] h-[33px] text-[14px] sm:text-base text-[#828293] flex justify-center items-center cursor-pointer"
              >
                {drop}
                {dropOnOff ? (
                  <Image
                    src="/arrow/up-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                ) : (
                  <Image
                    src="/arrow/down-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                )}
              </div>
              {dropOnOff ? (
                <UserDropdown setCateDrop={setDrop} cateDrop={drop} />
              ) : null}
            </div>
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

      {/* 모바일 */}
      <div className="sm:hidden max-w-[635px] w-full m-auto scrollbar-none">
        <h1 className="max-w-[390px] m-auto mt-6 mb-[30px] pl-6 text-[20px] font-bold">
          {searchWord ? `'${searchWord}' ` : " '-' "}
          <span className="text-textGray">&nbsp;검색 결과</span>
        </h1>
        <div className="max-w-[390px] w-full m-auto flex justify-center mb-12">
          <Category setCate={setCate} />
        </div>
        <div className="w-full m-auto min-h-screen ">
          <div className="inner-top-wrap max-w-[390px] w-full m-auto flex justify-between items-center mt-[-30px] mb-[20px]">
            <p className="ml-6 text-sm font-semibold">
              게시물{" "}
              <span className="text-primary">
                {cate === "전체"
                  ? searchData?.length
                  : searchData?.filter((post: any) => cate === post.item.type)
                      .length}
              </span>
            </p>
            {/* <Dropdown setDrop={setDrop} drop={drop} /> */}
            <div>
              <div
                onClick={() => setDropOnOff(!dropOnOff)}
                className="pr-3 sm:pr-0 pb-3 sm:pb-0 w-[111px] h-[33px] text-[14px] sm:text-base text-[#828293] flex justify-center items-center cursor-pointer"
              >
                {drop}
                {dropOnOff ? (
                  <Image
                    src="/arrow/up-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                ) : (
                  <Image
                    src="/arrow/down-arrow.png"
                    className="absolute ml-16 sm:ml-20"
                    width={10}
                    height={6}
                    alt=""
                  />
                )}
              </div>
              {dropOnOff ? (
                <UserDropdown setCateDrop={setDrop} cateDrop={drop} />
              ) : null}
            </div>
          </div>
          <div className="card-wrap max-w-[390px] m-auto px-4 w-full grid grid-cols-2 gap-4 place-items-center ">
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  const search = context.query.search as string;
  const searchWord = search?.replaceAll("/", "");
  return {
    props: { searchWord },
  };
};
