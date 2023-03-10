import { authService, dbService, storageService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { FiHeart, FiMoreVertical, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { TfiTrash } from "react-icons/tfi";
import { BsShareFill } from "react-icons/bs";
import { RiAlarmWarningLine } from "react-icons/ri";
import { MdOutlineEditNote } from "react-icons/md";

import Layout from "@/components/layout";
import Grade from "../../components/grade";
import Comments from "@/components/comment/comments";
import useModal from "@/hooks/useModal";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/css"; //basic
import "swiper/css/pagination";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";
import { BEER_IMG, ETC_IMG, LIQUOR_IMG, SOJU_IMG } from "@/util";
import useDeletePost from "@/hooks/query/post/useDeletePost";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";

const PostDetail = () => {
  const router = useRouter();

  const [sessionId, setSessionId] = useState<string>();
  const postId = (router.query.postId as string) || (sessionId as string);

  useEffect(() => {
    if (typeof window !== undefined) {
      const session_postId = sessionStorage.getItem("POST_ID");
      setSessionId(session_postId as string);
    }
    if (sessionId !== postId) {
      sessionStorage.removeItem("POST_ID");
      sessionStorage.setItem("POST_ID", postId);
    }
  }, []);

  SwiperCore.use([Pagination]);

  const [post, setPost] = useState<Form>();
  const getPost = async () => {
    const docRef = doc(dbService, "Posts", postId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const newPost = {
      ...data,
    };
    setPost(newPost);
  };

  const [user, setUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    introduce: "",
    point: 0,
    following: [],
    follower: [],
    recently: [],
  });

  const [imgIdx, setImgIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });
  // 전역모달
  const { showModal, hideModal } = useModal();
  const [reportId, setReportId] = useState<string>("");

  // 로그인 유무 체크
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
          // alert("클립보드에 복사되었습니다.");
          showModal({
            modalType: "AlertModal",
            modalProps: {
              src: "/image/Check_circle.svg",
              title: "클립보드에 복사되었습니다.",
            },
          });
          setIsOpen(false);
        })
        .catch(() => {
          // alert("복사를 다시 시도해주세요.");
          showModal({
            modalType: "AlertModal",
            modalProps: { title: "복사를 다시 시도해주세요." },
          });
        });
    } else {
      // 흐름 2.
      if (!document.queryCommandSupported("copy")) {
        // return alert("복사하기가 지원되지 않는 브라우저입니다.");
        showModal({
          modalType: "AlertModal",
          modalProps: { title: "복사하기가 지원되지 않는 브라우저입니다." },
        });
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
      // alert("클립보드에 복사되었습니다.");
      showModal({
        modalType: "AlertModal",
        modalProps: {
          title: "클립보드에 복사되었습니다.",
        },
      });
    }
  };

  // Delete Post
  const { isLoading: removePostLoading, mutate: deletePost } =
    useDeletePost(postId);

  const onDeletePost = async () => {
    await deletePost(postId);

    // Delete Image
    const postImgId = post?.img?.map((item: string) => {
      if (
        item !== SOJU_IMG &&
        item !== BEER_IMG &&
        item !== LIQUOR_IMG &&
        item !== ETC_IMG
      ) {
        return item.split("2F")[1].split("?")[0];
      } else {
        return null;
      }
    });

    postImgId?.map(async (item: string | null) => {
      if (item !== null && item !== undefined) {
        const desertRef = ref(storageService, `post/${item}`);

        await deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
          })
          .catch((error) => {
            console.log("error", error);
            // Uh-oh, an error occurred!
          });
      }
    });
    hideModal();
    router.push("/main");
  };

  // Update Post
  const { isLoading: isLoadingPost, mutate: updatePost } =
    useUpdatePost(postId);

  const likedUser = post?.like!.includes(authService.currentUser?.uid!);
  const postLike = async () => {
    if (authService.currentUser) {
      if (likedUser) {
        const editPostObj = {
          ...post,
          like: post?.like!.filter(
            (prev: string) => prev !== authService.currentUser?.uid
          ),
        };
        await updatePost({
          postId,
          editPostObj,
        });
        setPost({
          ...post,
          like: post?.like!.filter(
            (prev) => prev !== authService.currentUser?.uid
          ),
        });
      } else {
        const editPostObj = {
          ...post,
          like: [...post?.like!, authService.currentUser?.uid],
        };
        await updatePost({
          postId,
          editPostObj,
        });
        setPost({
          ...post,
          like: [...post?.like!, authService.currentUser?.uid],
        });
      }
    } else {
      showModal({
        modalType: "ConfirmModal",
        modalProps: {
          title: "로그인 후 이용 가능합니다.",
          text: "로그인 페이지로 이동하시겠어요?",
          rightbtnfunc: () => {
            showModal({
              modalType: "LoginModal",
              modalProps: {},
            });
          },
        },
      });
    }
  };

  const updateView = async () => {
    const docRef = doc(dbService, "Posts", postId);
    const docSnap = await getDoc(docRef);
    const forUpdate = {
      ...docSnap.data(),
    };

    let curView = ++forUpdate.view;
    const editPostObj = {
      ...post,
      view: curView,
    };
    try {
      await updatePost({
        postId,
        editPostObj,
      });
    } catch (error) {
      alert(error);
    }
  };

  const getComments = async () => {
    const q = query(
      collection(dbService, "Comments"),
      orderBy("createdAt", "desc"),
      where("postId", "==", postId as string)
    );

    onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc: any) => {
        const newComment = {
          id: doc.id,
          ...doc.data(),
        };
        return newComment;
      });
      setComments(newComments);
    });
  };

  // Update User
  const { isLoading: isLoadingEditUser, mutate: updateUser } = useUpdateUser(
    authService.currentUser?.uid as string
  );

  const updateUserRecently = async () => {
    const snapshot = await getDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string)
    );
    const snapshotdata = await snapshot.data();
    const newPost = {
      ...snapshotdata,
    };
    if (!newPost?.recently.includes(postId)) {
      await newPost?.recently.unshift(postId);
      updateUser({
        userId: authService.currentUser?.uid,
        editUserObj: { recently: newPost?.recently },
      });
    }
  };

  const onClickReportPost = async () => {
    const snapshot = await getDoc(doc(dbService, "ReportPosts", postId));
    const snapshotdata = await snapshot.data();
    const pastPost = {
      ...snapshotdata,
    };

    if (authService.currentUser?.uid) {
      if (pastPost.reporter) {
        if (
          pastPost.reporter
            .map((rep: any) => rep.userId === authService.currentUser?.uid)
            .includes(true)
        ) {
          showModal({
            modalType: "AlertModal",
            modalProps: {
              title: "이미 신고한 게시물입니다.",
            },
          });
          return;
        } else {
          showModal({
            modalType: "ReportModal",
            modalProps: { type: "post", post, currentUser, pastPost, reportId },
          });
        }
      } else if (!pastPost.reporter) {
        showModal({
          modalType: "ReportModal",
          modalProps: { type: "post", post, currentUser, pastPost, reportId },
        });
      }
    } else {
      showModal({
        modalType: "ConfirmModal",
        modalProps: {
          title: "로그인 후 이용 가능합니다.",
          text: "로그인 페이지로 이동하시겠어요?",
          rightbtnfunc: () => {
            showModal({
              modalType: "LoginModal",
              modalProps: {},
            });
          },
        },
      });
    }
  };

  const getUser = async () => {
    const userRef = doc(dbService, "Users", post?.userId as string);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const newUser = {
      ...userData,
    };

    setUser(newUser);
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

  useEffect(() => {
    if (postId) {
      if (authService.currentUser) {
        updateUserRecently();
      }
      updateView();
      getPost();
      setReportId(postId);
      getComments();
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      getUser();
    }
  }, [post]);

  useEffect(() => {
    getCurrentUser();
  }, [authService.currentUser?.uid]);

  return (
    <Layout>
      <div className="sm:max-w-[1200px] w-full mx-auto sm:py-20 sm:px-4 relative">
        <div
          id="breadcrumbs"
          className="hidden w-full space-x-2 sm:flex items-center mb-3.5 text-lg px-4 sm:px-5 xl:px-0"
        >
          <Link aria-label="home" href="/" className="text-textGray">
            홈
          </Link>
          <span className="text-textGray"> &#62; </span>
          <span className="text-textBlack">{post?.type}</span>
        </div>
        <div
          id="post-detail"
          className="w-full flex flex-col sm:px-5 xl:px-0 sm:flex-row justify-start items-stretch md:space-x-12 xl:space-x-32 mb-16 sm:mb-32"
        >
          <div
            id="images-column"
            className="hidden sm:block sm:w-2/5 md:w-1/2 w-full"
          >
            {post?.img && (
              <Image
                priority
                width={486}
                height={486}
                alt=""
                src={post?.img === null ? "" : (post?.img![imgIdx] as string)}
                className="w-full max-w-[486px] aspect-square object-cover rounded"
              />
            )}
            <div className="mt-6 max-w-[486px] grid grid-cols-3 gap-6 items-center w-full">
              {post?.img?.map((img: string, i: number) => (
                <button
                  aria-label={`choice-img${i}`}
                  key={uuidv4()}
                  className={`${
                    img === post?.img![imgIdx]
                      ? "border-2 border-primary"
                      : "border-0"
                  } w-full aspect-square object-cover rounded overflow-hidden`}
                  onClick={() => onImgChange(i)}
                >
                  {img && (
                    <Image
                      priority
                      width={150}
                      height={150}
                      alt=""
                      src={img}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:hidden w-full aspect-[4/3]">
            <Swiper
              slidesPerView={1}
              pagination={{ clickable: true }}
              grabCursor={true}
            >
              {post?.img?.map((img: string) => (
                <SwiperSlide key={uuidv4()} className="w-full">
                  {img && (
                    <Image
                      priority
                      src={img}
                      width={350}
                      height={350}
                      alt=""
                      className="w-full aspect-[4/3] object-cover"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div
            id="detail-info-column"
            className="w-full lg:w-1/2 sm:w-[55%] relative mt-10 sm:mt-0 "
          >
            <div
              id="title-column"
              className="flex justify-between items-start px-4 sm:px-0"
            >
              <div className="flex flex-col items-start space-y-2">
                <h4 className="text-lg sm:text-3xl font-bold">{post?.title}</h4>
                <span className="block py-1 px-5 rounded-full text-xs sm:text-sm text-primary bg-second">
                  {post?.type}
                </span>
              </div>
              <div className="flex justify-end items-start sm:items-center space-x-5">
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-1.5">
                  <button aria-label="like-btn" onClick={postLike}>
                    {likedUser ? (
                      <FaHeart className="text-primary" size={23} />
                    ) : (
                      <FiHeart className="text-primary" size={23} />
                    )}
                  </button>
                  <span className="text-textGray text-[11px] sm:text-base">
                    {post?.like!.length}
                  </span>
                </div>
                {authService.currentUser?.uid === post?.userId && (
                  <>
                    <button
                      aria-label="view-more"
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                    >
                      <FiMoreVertical className="w-5 h-5 text-iconDefault hover:text-iconHover" />
                    </button>
                    {isOpen && (
                      <div className="fixed bottom-0 sm:absolute sm:top-14 right-0 z-20 bg-white border-second sm:border flex flex-col items-center sm:py-1.5 sm:px-0.5 w-full sm:w-auto h-fit">
                        <div className="sm:hidden flex justify-center items-center space-x-5 py-5 border-t border-t-borderGray w-full relative">
                          <span className="font-bold">더보기</span>
                          <button
                            aria-label="close-btn"
                            className="absolute right-7 w-[18px] h-[18px]"
                            onClick={() => setIsOpen(false)}
                          >
                            <FiX className="text-phGray w-full h-full" />
                          </button>
                        </div>
                        <Link
                          aria-label="edit-post-btn"
                          href={{
                            pathname: `/post/edit/${post?.title?.replaceAll(
                              " ",
                              "_"
                            )}`,
                            query: {
                              id: postId,
                            },
                          }}
                          as={`/post/edit/${post?.title?.replaceAll(" ", "_")}`}
                          className="flex justify-center items-center space-x-5 sm:px-5 py-5 sm:py-2.5 border-t border-t-borderGray sm:border-t-0 w-full"
                        >
                          <span> 게시물 수정하기</span>{" "}
                          <MdOutlineEditNote
                            className="hidden sm:block"
                            size={18}
                          />
                        </Link>
                        <button
                          aria-label="remove-post-btn"
                          className="flex justify-center items-center space-x-5 sm:px-5 py-5 sm:py-2.5 border-t border-t-borderGray sm:border-t-0 w-full"
                          onClick={() => {
                            setIsOpen(false);
                            showModal({
                              modalType: "ConfirmModal",
                              modalProps: {
                                title: "게시물을 삭제 하시겠어요?",
                                text: "삭제한 게시물은 복원이 불가합니다.",
                                rightbtntext: "삭제",
                                rightbtnfunc: onDeletePost,
                              },
                            });
                          }}
                        >
                          <span>게시물 삭제하기</span>
                          <TfiTrash className="hidden sm:block" size={18} />
                        </button>
                        <button
                          aria-label="share-post-btn"
                          className="flex justify-center items-center space-x-5 sm:px-5 py-5 sm:py-2.5 border-t border-t-borderGray sm:border-t-0 w-full"
                          onClick={doCopy}
                        >
                          <span>게시물 공유하기</span>
                          <BsShareFill
                            size={18}
                            className="p-0.5 hidden sm:block"
                          />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              id="post-user"
              className="flex justify-start items-center space-x-7 mt-7 px-4 sm:px-0"
            >
              <div className="flex flex-col items-center justify-start space-y-2">
                <Link
                  aria-label="post-user"
                  href={{
                    pathname: `${
                      authService.currentUser?.uid === user?.userId
                        ? `/mypage`
                        : `/users/${user?.nickname}`
                    }`,
                    query: {
                      userId: user?.userId,
                    },
                  }}
                  as={`${
                    authService.currentUser?.uid === user?.userId
                      ? `/mypage`
                      : `/users/${user?.nickname}`
                  }`}
                  className="w-12 sm:w-16 flex justify-center items-center"
                >
                  {user?.imageURL ? (
                    <Image
                      priority
                      width={64}
                      height={64}
                      alt=""
                      src={user?.imageURL as string}
                      className="w-12 sm:w-16 aspect-square rounded-full object-cover border-borderGray"
                    />
                  ) : (
                    <div className="w-12 sm:w-16 aspect-square bg-slate-300 rounded-full object-cover" />
                  )}
                </Link>
                <Link
                  aria-label="post-user"
                  href={{
                    pathname: `${
                      authService.currentUser?.uid === user?.userId
                        ? `/mypage`
                        : `/users/${user?.nickname}`
                    }`,
                    query: {
                      userId: user?.userId,
                    },
                  }}
                  as={`${
                    authService.currentUser?.uid === user?.userId
                      ? `/mypage`
                      : `/users/${user?.nickname}`
                  }`}
                  className="flex justify-center items-center"
                >
                  <span className="font-bold mr-1 text-xs sm:text-sm block w-max">
                    {user?.nickname}
                  </span>
                  <span className="w-[10px]">
                    <Grade score={user?.point!} />
                  </span>
                </Link>
              </div>
              <pre className="whitespace-pre-wrap break-all text-xs sm:text-base">
                {post?.text}
              </pre>
            </div>
            <div className="mt-10 mb-6 h-[7px] sm:h-[1.5px] w-full bg-detailBorder" />
            <div id="ingredient" className="px-4 sm:px-0">
              <span className="inline-block font-semibold text-primary sm:text-lg mb-4">
                준비물
              </span>
              <div className="flex justify-start flex-wrap">
                {post?.ingredient?.map((ing: string) => (
                  <Link
                    aria-label={ing}
                    key={uuidv4()}
                    href={`/search/include/${ing.replaceAll(" ", "_")}`}
                    className="inline-block mr-4 mb-4 sm:mr-6 sm:mb-4 py-1 px-5 sm:px-6 rounded-full border border-gray-700 cursor-pointer hover:text-textGray transition text-xs sm:text-sm"
                  >
                    {ing}
                  </Link>
                ))}
              </div>
            </div>
            <div className="my-6 h-[7px] sm:h-[1.5px] w-full bg-detailBorder" />
            <div id="recipe" className="px-4 sm:px-0">
              <span className="inline-block font-semibold text-primary sm:text-lg mb-4">
                만드는 방법
              </span>
              <pre className="text-xs sm:text-base whitespace-pre-wrap break-all !leading-10 pl-2">
                {post?.recipe}
              </pre>
            </div>
            {authService.currentUser?.uid !== post?.userId && (
              <div className="absolute right-[38px] -bottom-14 flex items-center space-x-5 sm:space-x-6">
                <button
                  aria-label="share-post-btn"
                  onClick={doCopy}
                  className="w-5 sm:w-6"
                >
                  <BsShareFill className="w-5 sm:w-6 text-iconDefault hover:text-primary" />
                </button>
                <button
                  aria-label="report-post-btn"
                  onClick={onClickReportPost}
                  className="flex flex-col items-center group w-max"
                >
                  <RiAlarmWarningLine className="w-3 sm:w-4 text-iconDefault group-hover:text-primary" />
                  <span className="text-[10px] text-iconDefault group-hover:text-primary">
                    신고
                  </span>
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
        {isOpen && (
          <div className="sm:hidden fixed bottom-0 left-0 w-screen h-screen bg-black/50 z-10" />
        )}
      </div>
      <style jsx global>{`
        .swiper-pagination .swiper-pagination-bullet {
          background: #d9d9d9;
          opacity: 1;
        }
        .swiper-pagination .swiper-pagination-bullet-active {
          background: #ff6161;
        }
      `}</style>
    </Layout>
  );
};

export default PostDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.postId ? context.query.postId : "";

  return {
    props: {
      postId,
    },
  };
};
