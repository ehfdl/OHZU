import { authService, dbService } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import Layout from "@/components/layout";
import Link from "next/link";
import { FiHeart, FiMoreVertical } from "react-icons/fi";
import { FaHeart, FaCrown } from "react-icons/fa";
import { AiOutlineLink, AiFillAlert } from "react-icons/ai";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CommentList from "@/components/comment/comment_list";
import DeleteModal from "@/components/delete_modal";

const PostDetail = () => {
  const router = useRouter();
  const ref = useRef();
  const date = new Date();
  const dateForm = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(date);

  let docId: string;
  if (typeof window !== "undefined") {
    docId = window.location.pathname.substring(6);
  }

  const [post, setPost] = useState<Form>({
    userId: "",
    img: [],
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const initialComment = {
    content: "",
    postId: "",
    userId: "",
    createdAt: "",
    isEdit: false,
  };
  const [comment, setComment] = useState<CommentType>(initialComment);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [postId, setPostId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setComment({
      ...comment,
      [name]: value,
    });
  };

  const addComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newComment = {
      content: comment.content,
      postId: router.query.postId,
      userId: authService.currentUser?.uid!,
      createdAt: dateForm,
      isEdit: false,
    };
    if (comment.content.trim() !== "") {
      await addDoc(collection(dbService, "Comments"), newComment);
    } else {
      alert("내용이 없습니다!");
    }
    setComment(initialComment);
  };
  // url 공유함수
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

  const deleteToggle = () => {
    setDeleteConfirm(!deleteConfirm);
  };

  const deletePost = async (id: string) => {
    await deleteDoc(doc(dbService, "Posts", id));
    router.push("/");
  };

  const getId = async () => {
    const docRef = doc(dbService, "Posts", docId);
    // const docRef = doc(dbService, "Posts", docId as string); // 새로고침 시 에러
    const docSnap = await getDoc(docRef);
    const docID = docSnap.id;
    setPostId(docID);
  };

  const likedUser = post?.like!.includes(authService.currentUser?.uid!);
  const postLike = async (id: string) => {
    if (authService.currentUser) {
      if (likedUser) {
        await updateDoc(doc(dbService, "Posts", id), {
          like: post?.like!.filter(
            (prev) => prev !== authService.currentUser?.uid
          ),
        });
      } else {
        await updateDoc(doc(dbService, "Posts", id), {
          like: [...post?.like!, authService.currentUser?.uid],
        });
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
    getPost();
  };
  const getPost = async () => {
    const docRef = doc(dbService, "Posts", docId);
    // const docRef = doc(dbService, "Posts", docId as string); // 새로고침 시 에러
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    setPost((prev) => ({ ...prev, ...data }));
  };

  const getComments = async () => {
    const q = query(
      collection(dbService, "Comments"),
      orderBy("createdAt", "desc") // 해당 collection 내의 docs들을 createdAt 속성을 내림차순 기준으로
    );

    onSnapshot(q, (snapshot) => {
      // q (쿼리)안에 담긴 collection 내의 변화가 생길 때 마다 매번 실행됨
      const newComments = snapshot.docs.map((doc: any) => {
        const newComment = {
          id: doc.id,
          ...doc.data(), // doc.data() : { text, createdAt, ...  }
        };
        return newComment;
      });
      setComments(newComments);
    });
  };

  const updateView = async () => {
    const docRef = doc(dbService, "Posts", docId);
    const docSnap = await getDoc(docRef);
    const forUpdate = {
      ...docSnap.data(),
    };
    let curView = ++forUpdate.view;
    try {
      await updateDoc(docRef, { view: curView });
    } catch (error) {
      alert(error);
    }
  };
  const updateUserRecently = async () => {
    const snapshot = await getDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string)
    );
    const snapshotdata = await snapshot.data();
    const newPost = {
      ...snapshotdata,
    };
    if (!newPost.recently.includes(docId)) {
      await newPost.recently.unshift(docId);
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        { recently: newPost.recently }
      );
    }
  };

  const getUser = async () => {
    const docRef = doc(dbService, "Users", post.userId as string);
    // const docRef = doc(dbService, "Posts", docId as string); // 새로고침 시 에러
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const newUser = {
      ...data,
    };

    setUser(newUser);
  };

  useEffect(() => {
    // const getComments = async () => {
    //   const first = query(
    //     collection(dbService, "comments"),
    //     orderBy("createdAt", "desc"),
    //     limit(3)
    //   );

    //   const documentSnapshots = await getDocs(first);

    //   const lastVisible =
    //     documentSnapshots.docs[documentSnapshots.docs.length - 1];

    //   const next = query(
    //     collection(dbService, "comments"),
    //     orderBy("createdAt", "desc"),
    //     startAfter(lastVisible),
    //     limit(3)
    //   );

    //   console.log(first, lastVisible, next);
    // };
    if (authService.currentUser) {
      updateUserRecently();
    }
    getPost();
    getComments();
    updateView();
    getId();

    return setIsOpen(false);
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
              src={post.img === null ? "" : post.img![imgIdx]}
              className="w-full bg-slate-300 aspect-square object-cover rounded"
            />
            <div className="my-5 flex justify-start space-x-6 items-center w-full">
              {post.img?.map((img, i) => (
                <button
                  className={`${
                    img === post.img![imgIdx]
                      ? "border-2 border-black"
                      : "border-0"
                  } w-[30%] bg-slate-300 aspect-square object-cover rounded overflow-hidden`}
                  onClick={() => onImgChange(i)}
                >
                  <img
                    key={i}
                    src={img}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
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
              <div className="flex justify-end items-start space-x-2">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => postLike(router.query.postId as string)}
                  >
                    {likedUser ? (
                      <FaHeart size={24} color={"#ff6161"} />
                    ) : (
                      <FiHeart size={24} />
                    )}
                  </button>
                  <span>{post.like!.length}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <FiMoreVertical size={24} />
                </button>
                {isOpen && (
                  <div className="absolute top-14 right-0 z-10 bg-white border-black border  flex flex-col space-y-2 items-center p-4">
                    <Link href="/post/edit">게시글 수정하기</Link>
                    <button onClick={deleteToggle}>게시글 삭제하기</button>
                  </div>
                )}
              </div>
            </div>
            {deleteConfirm && (
              <DeleteModal
                deletePost={deletePost}
                setDeleteConfirm={setDeleteConfirm}
                id={postId}
                text="게시글"
              />
            )}
            <div id="post-user" className="flex items-start space-x-6 mt-7">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={user.imageURL}
                  className="w-20 aspect-square bg-slate-300 rounded-full"
                />
                <div className="flex justify-center items-center space-x-1">
                  <span>{user.nickname}</span>
                  <span>
                    <FaCrown size={16} />
                  </span>
                </div>
              </div>
              <div>
                <pre>{post.text}</pre>
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
              <pre className="pl-3 box-content">{post.recipe}</pre>
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
            <img className="bg-slate-300 w-12 aspect-square rounded-full" />
            <textarea
              disabled={authService.currentUser ? false : true}
              name="content"
              value={comment.content}
              onChange={handleChange}
              id=""
              className="w-full p-2 border h-10 resize-none"
              placeholder="댓글을 입력해주세요."
            />
            <button
              disabled={authService.currentUser ? false : true}
              onClick={addComment}
              className="absolute right-0 pr-4 disabled:text-gray-400"
            >
              <span className="text-sm font-medium">등록</span>
            </button>
          </form>
          <ul
            id="comment-list"
            className="mt-10 divide-y-[1px] divide-gray-300"
          >
            {comments?.map((comment) => {
              if (typeof window !== "undefined") {
                const docId = window.location.pathname.substring(6);
                if (docId === comment.postId) {
                  return <CommentList key={comment.id} comment={comment} />;
                }
              }
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
