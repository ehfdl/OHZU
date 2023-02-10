import Layout from "@/components/layout";
import { dbService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Detail = () => {
  const [post, setPost] = useState<Form>({
    userId: "",
    img: "",
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    liked: [],
    view: 0,
  });

  useEffect(() => {
    const docId = window.location.pathname.substring(6);
    // const docId = router.query.postId;

    const getPost = async () => {
      const docRef = doc(dbService, "Posts", docId);
      // const docRef = doc(dbService, "Posts", docId as string); // 새로고침 시 에러
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      console.log("🚀 ~ file: [...postId].tsx:38 ~ getPost ~ data", data);
      setPost((prev) => ({ ...prev, ...data }));
    };
    getPost();
  }, []);

  return (
    <Layout>
      <img src={post.img!} className="bg-gray-300 w-full aspect-square" />
      <div className="px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-x-3 flex items-end">
            <span className="text-2xl font-medium">{post.title}</span>
            <span className="text-xs inline-block px-3 py-1 bg-gray-300 rounded-full">
              {post.type}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                ></path>
              </svg>
            </span>
            <span className="text-xs">{post.like.length}</span>
          </div>
        </div>
        <div className="flex space-x-4 justify-start items-start pb-4">
          <div className="flex flex-col items-center justify-center w-[25%]">
            <div className="bg-gray-300 rounded-full w-full aspect-square" />
            <span className="text-sm">Nick</span>
          </div>
          <p className="text-sm w-full">{post.text}</p>
        </div>
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-gray-300 px-4 py-1">
            재료
          </span>
          <p className="ml-4">{post.ingredient}</p>
        </div>
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-gray-300 px-4 py-1">
            만드는 방법
          </span>
          <p className="ml-4">{post.recipe}</p>
        </div>
      </div>
      <hr></hr>
      <div className="px-4 py-10">
        <form className="flex flex-col justify-center items-end space-y-2">
          <textarea
            className="border w-full p-3 placeholder:text-sm focus:outline-none"
            name="comments"
            placeholder="Comments"
            rows={4}
          />
          <button className="bg-gray-300 px-4 py-1">작성</button>
        </form>
        <ul className="flex flex-col divide-y-[1px] mt-5">
          {[1, 2, 3, 4].map((_, i) => (
            <li
              key={i}
              className="py-4 flex items-start justify-between space-x-3"
            >
              <div className="flex items-start">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 aspect-square rounded-full bg-gray-300" />
                  <span className="text-sm">nick</span>
                </div>
              </div>
              <p className="text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the
              </p>
              <div className="flex justify-end space-x-2 items-center w-36">
                <button className="text-xs">수정</button>
                <button className="text-xs">삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Detail;
