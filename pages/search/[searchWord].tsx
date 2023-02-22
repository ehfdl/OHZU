import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Category from "@/components/main_page/Category";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { authService, dbService } from "@/firebase";
import Fuse from "fuse.js";
import { SearchCard } from "@/components/search_card";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";

interface PropsType {
  searchWord: string;
}

export default function Searchwords() {
  const router = useRouter();

  const searchWord = decodeURI(window.location.pathname.substring(8));
  // console.log("검색창 키워드 디코드 searchWord : ", searchWord);

  const [cate, setCate] = useState("전체");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchData, setSearchData]: any = useState();
  const [drop, setDrop] = useState("최신순");

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

  console.log("searchData : ", searchData);

  // let arrLike = searchData.sort((a: any, b: any) => {
  //   if (drop === "like") {
  //     return a.like.length - b.like.length;
  //   } else if (drop === "view") {
  //     return a.view.length - b.view.length;
  //   }
  // });

  // console.log("arrLike 솔트", arrLike);

  let newSearchData = [...posts];
  console.log("newSearchData : ", newSearchData);

  newSearchData = newSearchData.sort((a: any, b: any) => {
    return b.like?.length - a.like?.length;
  });
  console.log("솔트 newSearchData : ", newSearchData);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] w-full m-auto ">
        <h1 className="mt-20 mb-11 text-[40px] font-bold">
          {searchWord ? searchWord : " - "}{" "}
          <span className="text-[#8E8E93]">검색결과</span>
        </h1>
        <div className=" w-full flex justify-center mb-12">
          <Category setCate={setCate} cate={cate} />
        </div>
        <div className="max-w-[1200px] m-auto min-h-screen ">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px] font-semibold">
              게시글{" "}
              <span className="text-[#FF6161]">{searchData?.length}</span>
            </p>
            <Dropdown setDrop={setDrop} drop={drop} />
          </div>
          <div className="card-wrap grid grid-cols-3 gap-6 justify-between">
            {searchData?.map((card: any) =>
              // 카테고리 정렬
              cate === "전체" ? (
                <SearchCard key={card.item.postId} card={card} />
              ) : cate === card.item.type ? (
                <SearchCard key={card.item.postId} card={card} />
              ) : null
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
// 카테고리 정상 기능 코드
// {searchData?.map((card: any) =>
//   // 카테고리 정렬
//   cate === "전체" ? (
//     <SearchCard key={card.item.postId} card={card} />
//   ) : cate === card.item.type ? (
//     <SearchCard key={card.item.postId} card={card} />
//   ) : null
// )}

// 인기 = like순
// 최신 = createAt순
// 조회 = view순

{
  /* {searchData
              ?.sort((a: any, b: any) => {
                if (a.item.like!.length < b.item.like!.length) return 1;
                if (a.item.like!.length > b.item.like!.length) return -1;
                return 0;
              })
              ?.map((card: any) =>
                drop === "정렬" ? (
                  <SearchCard key={card.item.postId} card={card} />
                ) : drop === card.item.like ? (
                  <SearchCard key={card.item.postId} card={card} />
                ) : null
              )} */
}

// 정렬
{
  /* {() => {
              searchData.sort((a: any, b: any) => {
                if (drop === "like") {
                  return a.like.length - b.like.length;
                } else if (drop === "view") {
                  return a.view.length - b.view.length;
                }
              });
            }} */
}
