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

interface PropsType {
  searchWord: string;
}

export default function Searchwords({ searchWord }: PropsType) {
  const router = useRouter();
  console.log("header에서 받아온 라우터 : ", router);

  console.log("searchWord", searchWord);

  // const searchWord = window.location.pathname.substring(7);
  // const searchWord = window.location.pathname.substring(8);
  // console.log("searchWord : ", decodeURI(searchWord));

  const [cate, setCate] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchData, setSearchData]: any = useState();
  // const [] = useState()

  // const initialState = "searchPage";

  // if (searchWord == "") {
  //   searchWord = initialState;
  //   router.console.log("searchWord : ", searchWord);
  // }

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

  // 검색
  const postsData = new Fuse(posts, {
    keys: ["title", "ingredient"],
  });
  const result = postsData.search(searchWord);

  useEffect(() => {
    setSearchData(result);
  }, [searchWord]);

  // 내가 시도해본 것 (좋아요 기능)
  // 1. 다른 폴더의 페이지(user post card 등) 참고하여 시도해봄. 해당 페이지는 아마 시작부터 게시글 1개의 데이터를 받아오는 듯했다.
  // 2. posts가 DB 전체 데이터를 가지고 오니, 이것을 map으로 하나씩 나눠서 진행해봤지만, return문에서 사용하려니 scope가 맞지않아 실패
  // 3. state를 만들고 on/off를 시도해봄. 근데 하나 누르면 모든 게시글이 다 바뀜.

  // const [like, setLike] = useState(false)

  let cardLike = posts;

  // cardLike.map((item) => {
  //   console.log("item", item.like);
  //   return item;
  // });

  // console.log("====================================");
  // console.log(cardLike[0]);
  // console.log("====================================");

  // const [like, setLike] = useState(false)

  // const itemLike = posts].like.includes(authService.currentUser?.uid);

  //   const onClickLikeBtn = async () => {
  //     const likeArray = cardLike.map((item) => {
  //       console.log("item", item.like);
  //       item.like?.includes(authService.currentUser?.uid);

  //       if (item) {
  //         const newLikeArray = item.like?.filter(
  //           (id: any) => id !== authService.currentUser?.uid
  //         );
  //         updateDoc(doc(dbService, "Posts", item.postId), {
  //           like: newLikeArray,
  //         });
  //       } else if (!likeArray) {
  //         const newLikeArray = item.like?.push(authService.currentUser?.uid);
  //         updateDoc(doc(dbService, "Posts", item.postId), {
  //           like: item.like,
  //         });
  //       }
  //     });
  //   };

  return (
    <>
      <Header />
      <button onClick={() => onClickLikeBtn()}>눌러봐라</button>
      <div className="max-w-[1200px] w-full m-auto ">
        <h1 className="mt-20 mb-11 text-[40px]">
          {searchWord ? searchWord : " - "} <span>검색결과</span>
        </h1>
        <div className=" w-full flex justify-center mb-12">
          <Category setCate={setCate} />
        </div>
        <div className="max-w-[1200px] m-auto min-h-screen ">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px]">
              게시글 <span>{searchData?.length}</span>
              {/* 게시글 <span>200</span> */}
            </p>
            <Dropdown />
          </div>
          {/* <div className="card-wrap flex flex-wrap justify-between max-w-[1200px] bg-red-300 "> */}
          <div className="card-wrap flex grid grid-cols-3 gap-6 justify-between bg-red-200">
            {searchData?.map((card: any) => (
              <div className="card max-w-[384px] w-full h-[420px] mb-6 bg-[#f2f2f2] rounded  row-span-[1]">
                <img
                  className=" w-[384px] h-[284px] rounded-t bg-contain"
                  src={card.item.img[0]}
                />
                <div className="card-contents flex items-center mt-4 ml-5 relative mb-[14px]">
                  <div className="profile-pic w-11 h-11 rounded-full mr-3">
                    <img src="/user.png" />
                  </div>
                  <div className="contents-header-wrap flex justify-around ">
                    <div className="flex flex-col">
                      <h1 className="text-[22px]">{card.item.title}</h1>
                      <p className="text-[14px]">
                        {card.item.nickname ? card.item.nickname : "아무개"}
                      </p>
                    </div>

                    <div className="w-[18px] h-4 absolute top-2 right-5">
                      <img src="/like/like-default.png" />
                    </div>
                    {/* <div
                      onClick={onClickLikeBtn}
                      className="float-right translate-x-[80px] translate-y-[8px] w-6 mb-2"
                    >
                      {likeArray ? (
                        <img src="/like/like-pressed.png" />
                      ) : (
                        <img src="/like/like-default.png" />
                      )}
                    </div> */}
                  </div>
                </div>
                <p className=" text-[14px] max-w-[384px] w-full h-[45px]  px-4 overflow-hidden text-ellipsis-2">
                  {card.item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { searchWord },
}: any) => {
  return {
    props: { searchWord },
  };
};
