import { authService, dbService, storageService } from "@/firebase";
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
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";

import Link from "next/link";
import Layout from "@/components/layout";
import Grade from "../../components/grade";
import { FiHeart, FiMoreVertical } from "react-icons/fi";
import { FaHeart, FaCrown } from "react-icons/fa";
import { AiOutlineLink, AiFillAlert } from "react-icons/ai";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CommentList from "@/components/comment/comment_list";
import DeleteModal from "@/components/delete_modal";
import { deleteObject, ref } from "firebase/storage";
import { GetServerSideProps } from "next";
import Comments from "@/components/comment/comments";

interface PostDetailPropsType {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailPropsType) => {
  const router = useRouter();

  const [imgIdx, setImgIdx] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    id: "",
  });

  const [comments, setComments] = useState<CommentType[]>([]);
  const [user, setUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });
  const [currentUser, setCurrentUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });

  const onImgChange = (i: number) => {
    setImgIdx(i);
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

    const commentId = comments.filter((i) => i.postId === id).map((i) => i.id);

    commentId.map(async (id) => {
      await deleteDoc(doc(dbService, "Comments", id as string));
    });

    const postImgId = post.img!.map((item) => {
      return item.split("2F")[1].split("?")[0];
    });

    postImgId.map(async (item) => {
      const desertRef = ref(storageService, `post/${item}`);
      await deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          console.log("error", error);
          // Uh-oh, an error occurred!
        });
    });

    router.push("/");
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
    const docRef = doc(dbService, "Posts", postId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const id = docSnap.id;
    const newPost = {
      ...data,
      id,
    };

    setPost(newPost);
  };

  const getComments = async () => {
    const q = query(
      collection(dbService, "Comments"),
      orderBy("createdAt", "desc"),
      where("postId", "==", postId as string)
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
    const docRef = doc(dbService, "Posts", postId);
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
    if (!newPost.recently.includes(postId)) {
      await newPost.recently.unshift(postId);
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        { recently: newPost.recently }
      );
    }
  };

  const getUser = async () => {
    if (post?.userId) {
      const userRef = doc(dbService, "Users", post?.userId! as string);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const newUser = {
        ...userData,
      };

      setUser(newUser);
    }
  };

  const getCurrentUser = async () => {
    if (authService.currentUser?.uid) {
      const userRef = doc(
        dbService,
        "Users",
        authService.currentUser?.uid! as string
      );
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const newUser = {
        ...userData,
      };

      setCurrentUser(newUser);
    }
  };

  const onClickReportPost = async () => {
    const snapshot = await getDoc(doc(dbService, "ReportPosts", postId));
    const snapshotdata = await snapshot.data();
    const pastPost = {
      ...snapshotdata,
    };

    if (pastPost.reporter) {
      if (pastPost.reporter.includes(authService.currentUser?.uid)) {
        console.log("이미신고했습니당");
        return;
      } else {
        pastPost.reporter.push(authService.currentUser?.uid);
        await updateDoc(doc(dbService, "ReportPosts", postId), {
          reporter: pastPost.reporter,
        });
        console.log("새로운 신고자!");
      }
    } else if (!pastPost.reporter) {
      const newPost = {
        ...post,
        reporter: [authService.currentUser?.uid],
      };
      await setDoc(doc(dbService, "ReportPosts", postId), newPost);
      console.log("신고 완료");
    }
  };

  // const getComments = async () => {
  //   const first = query(
  //     collection(dbService, "Comments"),
  //     orderBy("createdAt", "desc"),
  //     limit(3)
  //   );

  //   const documentSnapshots = await getDocs(first);

  //   const lastVisible =
  //     documentSnapshots.docs[documentSnapshots.docs.length - 1];

  //   const next = query(
  //     collection(dbService, "Comments"),
  //     orderBy("createdAt", "desc"),
  //     startAfter(lastVisible),
  //     limit(3)
  //   );

  //   onSnapshot(first, (snapshot) => {
  //     // q (쿼리)안에 담긴 collection 내의 변화가 생길 때 마다 매번 실행됨
  //     const newComments = snapshot.docs.map((doc: any) => {
  //       const newComment = {
  //         id: doc.id,
  //         ...doc.data(), // doc.data() : { text, createdAt, ...  }
  //       };
  //       return newComment;
  //     });
  //     setComments(newComments);
  //   });

  //   // console.log("first", first);
  //   // console.log("lastVisible", lastVisible);
  //   // console.log("next", next);
  // };

  useEffect(() => {
    if (authService.currentUser) {
      updateUserRecently();
    }
    getPost();
    getComments();
    updateView();
  }, []);

  useEffect(() => {
    getCurrentUser();
    getUser();
  }, [post]);

  return (
    <Layout>
      <div className="sm:max-w-[1200px] mx-auto py-20">
        <div
          id="breadcrumbs"
          className="w-full space-x-2 flex items-center mb-4"
        >
          <Link href="/" className="text-gray-400">
            홈
          </Link>
          <span> &#62; </span>
          <span className="">{post.type}</span>
        </div>
        <div
          id="post-detail"
          className="w-full flex justify-between items-stretch space-x-10 mb-32"
        >
          <div id="images-column" className="w-2/5">
            <img
              src={post.img === null ? "" : post.img![imgIdx]}
              className="w-full bg-slate-300 aspect-square object-cover rounded"
            />
            <div className="my-5 flex justify-start space-x-6 items-center w-full">
              {post.img?.map((img, i) => (
                <button
                  key={i}
                  className={`${
                    img === post.img![imgIdx]
                      ? "border-2 border-black"
                      : "border-0"
                  } w-[30%] bg-slate-300 aspect-square object-cover rounded overflow-hidden`}
                  onClick={() => onImgChange(i)}
                >
                  <img
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
                  <button onClick={() => postLike(postId as string)}>
                    {likedUser ? (
                      <FaHeart size={24} color={"#ff6161"} />
                    ) : (
                      <FiHeart size={24} />
                    )}
                  </button>
                  <span>{post.like!.length}</span>
                </div>
                {authService.currentUser?.uid === post.userId && (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                    >
                      <FiMoreVertical size={24} />
                    </button>
                    {isOpen && (
                      <div className="absolute top-14 right-0 z-10 bg-white border-black border flex flex-col space-y-6 items-center px-10 py-6">
                        <Link href={`/post/edit/${postId}`}>
                          게시글 수정하기
                        </Link>
                        <button onClick={deleteToggle}>게시글 삭제하기</button>
                        <button onClick={doCopy}>게시글 공유하기</button>
                      </div>
                    )}
                  </>
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
              <div className="flex flex-col items-center justify-start space-y-2 w-[15%]">
                <Link href={`/users/${user.userId}`}>
                  <img
                    src={user?.imageURL}
                    className="w-20 aspect-square bg-slate-300 rounded-full object-cover"
                  />
                </Link>
                <Link
                  href={`/users/${post.userId}`}
                  className="flex justify-center items-center space-x-1"
                >
                  <span>{user?.nickname}</span>
                  <span className="w-[12px]">
                    <Grade score={user.point!} />
                  </span>
                </Link>
              </div>
              <div className="w-4/5">
                <pre className="whitespace-pre-wrap">{post.text}</pre>
              </div>
            </div>
            <div id="ingredient" className="mt-12 mb-16">
              <span className="inline-block px-5 py-2 bg-red-300 text-white mb-5 rounded-full">
                준비물
              </span>
              <p className="pl-3">{post.ingredient}</p>
            </div>
            <div id="recipe">
              <span className="inline-block px-5 py-2 bg-red-300 text-white mb-5 rounded-full">
                만드는 방법
              </span>
              <pre className="pl-3 whitespace-pre-wrap">{post.recipe}</pre>
            </div>
            {authService.currentUser?.uid !== post.userId && (
              <div
                id="faq"
                className="absolute right-0 -bottom-20 flex items-start space-x-2"
              >
                <button onClick={doCopy}>
                  <AiOutlineLink size={24} />
                </button>
                <button
                  onClick={onClickReportPost}
                  className="flex flex-col items-center space-y-1"
                >
                  <AiFillAlert size={24} />
                  <span className="text-xs">신고하기</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <Comments
          postId={postId}
          comments={comments}
          currentUser={currentUser}
          user={user}
          post={post}
        />
      </div>
    </Layout>
  );
};

export default PostDetail;

export const getServerSideProps: GetServerSideProps = async ({
  params: { postId },
}: any) => {
  return {
    props: { postId },
  };
};
