import { authService, dbService } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";

import Layout from "@/components/layout";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaCrown } from "react-icons/fa";
import { AiOutlineLink, AiFillAlert } from "react-icons/ai";
import { useEffect, useState } from "react";

const PostDetail = () => {
  const [post, setPost] = useState<Form>({
    userId: "",
    img: "",
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const doCopy = () => {
    // 흐음 1.
    if (navigator.clipboard) {
      // (IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능합니다.)
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("복사를 다시 시도해주세요.");
        });
    } else {
      // 흐름 2.
      if (!document.queryCommandSupported("copy")) {
        return alert("복사하기가 지원되지 않는 브라우저입니다.");
      }

      // 흐름 3.
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.position = "fixed";

      // 흐름 4.
      document.body.appendChild(textarea);
      // focus() -> 사파리 브라우저 서포팅
      textarea.focus();
      // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
      textarea.select();
      // 흐름 5.
      document.execCommand("copy");
      // 흐름 6.
      document.body.removeChild(textarea);
      alert("클립보드에 복사되었습니다.");
    }
  };

  useEffect(() => {
    const docId = window.location.pathname.substring(6);

    const getPost = async () => {
      const docRef = doc(dbService, "Posts", docId);
      // const docRef = doc(dbService, "Posts", docId as string); // 새로고침 시 에러
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const postId = docSnap.id;

      setPost((prev) => ({ ...prev, ...data, postId }));
    };

    getPost();
  }, []);

  return (
    <Layout>
      <div className="sm:max-w-[1200px] mx-auto py-20">
        <div
          id="breadcrumbs"
          className="w-full space-x-2 flex items-center mb-4"
        >
          <Link href="/">홈</Link>
          <span> &#62; </span>
          <Link href={`/`}>{post.type}</Link>
        </div>
        <div
          id="post-detail"
          className="w-full flex justify-between items-stretch space-x-10"
        >
          <div id="images-column" className="w-2/5">
            <img
              src={post.img!}
              className="w-full bg-slate-300 aspect-square"
            />
            <div className="my-5 flex justify-between items-center">
              <img
                src={post.img!}
                className="w-[30%] bg-slate-300 aspect-square"
              />
              <img
                src={post.img!}
                className="w-[30%] bg-slate-300 aspect-square"
              />
              <img
                src={post.img!}
                className="w-[30%] bg-slate-300 aspect-square"
              />
            </div>
          </div>
          <div id="detail-info-column" className="w-1/2 relative">
            <div id="title-column" className="flex justify-between items-start">
              <div className="flex flex-col items-start space-y-2">
                <h4 className="text-2xl font-medium">{post.title}</h4>
                <span className="block py-1 px-3 rounded-full text-sm bg-gray-200">
                  {post.type}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FiHeart size={24} />
                <span>{post.like.length}</span>
                {/* <FaHeart size={24} /> */}
              </div>
            </div>
            <div id="post-user" className="flex items-start space-x-6 mt-7">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-20 aspect-square bg-slate-300 rounded-full" />
                <div className="flex items-center space-x-1">
                  <span>홍길동</span>
                  <span>
                    <FaCrown size={16} />
                  </span>
                </div>
              </div>
              <div>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Sit mi nunc luctus
                  fermentum turpis arcu. Habitasse commodo odio nunc id lobortis
                  vitae. Diam feugiat sem{" "}
                </p>
              </div>
            </div>
            <div id="ingredient" className="mt-12 mb-16">
              <span className="inline-block px-5 py-2 bg-red-300 text-white mb-5 rounded-full">
                준비물
              </span>
              <p className="pl-3 box-content">{post.ingredient}</p>
            </div>
            <div id="recipe">
              <span className="inline-block px-5 py-2 bg-red-300 text-white mb-5 rounded-full">
                만드는 방법
              </span>
              <p className="pl-3 box-content">{post.text}</p>
            </div>
            <div
              id="faq"
              className="absolute right-0 bottom-0 flex items-center space-x-2"
            >
              <button onClick={doCopy}>
                <AiOutlineLink size={24} />
              </button>
              <button className="flex flex-col items-center">
                <AiFillAlert size={24} />
              </button>
            </div>
          </div>
        </div>
        <div id="comments" className="max-w-[768px] w-full mx-auto mt-20">
          <div className="text-xl font-medium space-x-2">
            <span>댓글</span>
            <span>123</span>
          </div>
          <div className="h-[1px] w-full bg-black mb-6" />
          <form className="w-full flex items-center relative space-x-6">
            <div className="bg-slate-300 w-[40px] aspect-square rounded-full" />
            <textarea
              name=""
              id=""
              className="w-full p-2 border min-h-[40px] h-10"
            ></textarea>
            <button className="absolute right-0 pr-4">
              <span className="text-sm font-medium">등록</span>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
