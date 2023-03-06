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

import { dehydrate, QueryClient } from "@tanstack/react-query";

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

import { getPost } from "@/api/postAPI";
import { useGetUser } from "@/hooks/query/user/useGetUser";
import useGetPost from "@/hooks/query/post/useGetPost";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";
import { BEER_IMG, ETC_IMG, LIQUOR_IMG, SOJU_IMG } from "@/util";
import useDeletePost from "@/hooks/query/post/useDeletePost";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";
import useGetReport from "@/hooks/query/reportPost/useGetReport";

interface PostDetailPropsType {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailPropsType) => {
  const router = useRouter();

  SwiperCore.use([Pagination]);

  const { data: postData, isLoading: postLoading } = useGetPost(postId);
  const { data: reportPost, isLoading: reportPostLoading } = useGetReport({
    reportId: postId,
    reportType: "ReportPosts",
  });

  const { data: user, isLoading: userLoading } = useGetUser(
    postData?.userId as string
  );

  const [post, setPost] = useState<Form>(postData!);

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
    router.push("/");
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
    let curView = ++post.view!;
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
    // const snapshot = await getDoc(doc(dbService, "ReportPosts", postId));
    // const snapshotdata = await snapshot.data();
    const pastPost = {
      ...reportPost,
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
    if (authService.currentUser) {
      updateUserRecently();
    }
    setReportId(postId);
    getComments();
    updateView();
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [authService.currentUser?.uid]);

  return (
    <Layout>
      <div className="sm:max-w-[1200px] w-full mx-auto sm:py-20 sm:px-4 relative">
        <div
          id="breadcrumbs"
          className="hidden w-full space-x-2 sm:flex items-center mb-10 text-sm"
        >
          <Link href="/" className="text-textGray">
            홈
          </Link>
          <span className="text-textGray"> &#62; </span>
          <span className="text-textBlack">{post?.type}</span>
        </div>
        <div
          id="post-detail"
          className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:space-x-10 mb-32"
        >
          <div id="images-column" className="hidden sm:block sm:w-2/5 w-full">
            <Image
              priority
              width={450}
              height={450}
              alt=""
              src={post?.img === null ? "" : post?.img![imgIdx]}
              className="w-full aspect-square object-cover rounded"
            />
            <div className="mt-6 grid grid-cols-3 gap-6 items-center w-full">
              {post?.img?.map((img: string, i: number) => (
                <button
                  key={uuidv4()}
                  className={`${
                    img === post?.img![imgIdx]
                      ? "border-2 border-primary"
                      : "border-0"
                  } w-full aspect-square object-cover rounded overflow-hidden`}
                  onClick={() => onImgChange(i)}
                >
                  <Image
                    priority
                    width={150}
                    height={150}
                    alt=""
                    src={img}
                    className="w-full aspect-square object-cover"
                  />
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
            className="w-full lg:w-1/2 sm:w-[55%] relative mt-10 sm:mt-0 px-4"
          >
            <div id="title-column" className="flex justify-between items-start">
              <div className="flex flex-col items-start">
                <h4 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                  {post?.title}
                </h4>
                <span className="block py-1 px-5 rounded-full text-xs sm:text-sm text-primary bg-second">
                  {post?.type}
                </span>
              </div>
              <div className="flex justify-end items-start space-x-2">
                <div className="flex flex-col items-center">
                  <button onClick={postLike}>
                    {likedUser ? (
                      <FaHeart className="text-primary" size={24} />
                    ) : (
                      <FiHeart className="text-primary" size={24} />
                    )}
                  </button>
                  <span className="text-textGray text-xs">
                    {post?.like!.length}
                  </span>
                </div>
                {authService.currentUser?.uid === post?.userId && (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                    >
                      <FiMoreVertical className="sm:w-6 sm:h-6 w-5 h-5 text-iconDefault hover:text-iconHover" />
                    </button>
                    {isOpen && (
                      <div className="fixed bottom-0 sm:absolute sm:top-14 right-0 z-20 bg-white border-second sm:border flex flex-col items-center sm:py-1.5 sm:px-0.5 w-full sm:w-auto h-fit">
                        <div className="sm:hidden flex justify-center items-center space-x-5 py-5 border-t border-t-borderGray w-full relative">
                          <span className="font-bold">더보기</span>
                          <button
                            className="absolute right-7 w-[18px] h-[18px]"
                            onClick={() => setIsOpen(false)}
                          >
                            <FiX className="text-phGray w-full h-full" />
                          </button>
                        </div>
                        <Link
                          href={`/post/edit/${postId}`}
                          className="flex justify-center items-center space-x-5 sm:px-5 py-5 sm:py-2.5 border-t border-t-borderGray sm:border-t-0 w-full"
                        >
                          <span> 게시글 수정하기</span>{" "}
                          <MdOutlineEditNote
                            className="hidden sm:block"
                            size={18}
                          />
                        </Link>
                        <button
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
                          <span>게시글 삭제하기</span>
                          <TfiTrash className="hidden sm:block" size={18} />
                        </button>
                        <button
                          className="flex justify-center items-center space-x-5 sm:px-5 py-5 sm:py-2.5 border-t border-t-borderGray sm:border-t-0 w-full"
                          onClick={doCopy}
                        >
                          <span>게시글 공유하기</span>
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
            <div id="post-user" className="flex items-start space-x-6 mt-7">
              <div className="flex flex-col items-center justify-start space-y-2 lg:w-[25%] w-[30%]">
                <Link href={`/users/${user?.userId}`}>
                  {user?.imageURL ? (
                    <Image
                      priority
                      width={100}
                      height={100}
                      alt=""
                      src={user?.imageURL as string}
                      className="w-12 sm:w-20 aspect-square rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 sm:w-20 aspect-square bg-slate-300 rounded-full object-cover" />
                  )}
                </Link>
                <Link
                  href={`/users/${post?.userId}`}
                  className="flex justify-center items-center"
                >
                  <span className="font-bold mr-1 text-xs sm:text-sm lg:text-base">
                    {user?.nickname}
                  </span>
                  <span className="w-[10px] sm:w-[12px]">
                    <Grade score={user?.point!} />
                  </span>
                </Link>
              </div>
              <div className="w-full pt-1">
                <pre className="whitespace-pre-wrap break-all text-xs sm:text-base">
                  {post?.text}
                </pre>
              </div>
            </div>
            <div id="ingredient" className="mt-10 mb-9">
              <span className="inline-block py-1.5 px-5 sm:px-7 sm:py-2 bg-primary text-white lg:text-xl text-sm rounded-full">
                준비물
              </span>
              <div className="pt-6 flex justify-start flex-wrap">
                {post?.ingredient?.map((ing: string) => (
                  <button
                    key={uuidv4()}
                    onClick={() => {
                      router.push(`/search/include/${ing}`);
                    }}
                    className="inline-block mr-4 mb-4 sm:mr-6 sm:mb-6 py-1.5 px-4 sm:px-6 rounded-full border border-gray-700 cursor-pointer hover:text-textGray transition text-xs sm:text-base"
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
            <div id="recipe">
              <span className="inline-block py-1.5 px-5 sm:px-7 sm:py-2 bg-primary text-white lg:text-xl text-sm rounded-full">
                만드는 방법
              </span>
              <pre className="text-xs sm:text-base pt-6 whitespace-pre-wrap break-all leading-10 pl-2">
                {post?.recipe}
              </pre>
            </div>
            {authService.currentUser?.uid !== post?.userId && (
              <div
                id="faq"
                className="absolute right-4 -bottom-16 flex items-start space-x-2 sm:space-x-6"
              >
                <button onClick={doCopy} className="w-[24px]">
                  <BsShareFill className="w-full text-iconDefault mt-1 hover:text-primary" />
                </button>
                <button
                  onClick={onClickReportPost}
                  className="flex flex-col items-center space-y-0.5 group w-[24px]"
                >
                  <RiAlarmWarningLine className="w-full text-iconDefault group-hover:text-primary" />
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
  const { postId } = context.params!;

  const queryClient = new QueryClient();

  let isError = false;

  try {
    await queryClient.prefetchQuery(["post", postId], () =>
      getPost(postId as string)
    );
  } catch (error: any) {
    isError = true;
    context.res.statusCode = error.response.status;
  }

  return {
    props: {
      postId,
      isError,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
