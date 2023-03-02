import { authService, dbService, storageService } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
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
import DeleteModal from "@/components/delete_modal";
import useModal from "@/hooks/useModal";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/css"; //basic
import "swiper/css/pagination";

interface PostDetailPropsType {
  postId: string;
  newPost: Form;
  newUser: UserType;
}

const PostDetail = ({ postId, newPost, newUser }: PostDetailPropsType) => {
  const router = useRouter();

  SwiperCore.use([Pagination]);

  const [imgIdx, setImgIdx] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [post, setPost] = useState<Form>(newPost);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [user, setUser] = useState<UserType>(newUser);
  const [currentUser, setCurrentUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });
  // 전역모달
  const { showModal, hideModal } = useModal();

  // 로그인 유무 체크
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
      const q = query(
        collection(dbService, "Recomments"),
        where("commentId", "==", id) // 해당 collection 내의 docs들을 createdAt 속성을 내림차순 기준으로
      );
      const querySnapshot = await getDocs(q);
      // doc.id는 DB가 자체적으로 생성하는 값으로, id도 함께 포함시키기 위해 객체 재구성
      const newRecomment: any = [];
      querySnapshot.forEach((doc) => {
        const newObj = {
          id: doc.id,
          ...doc.data(),
        };
        newRecomment.push(newObj.id);
      });

      newRecomment.map(async (id: string) => {
        await deleteDoc(doc(dbService, "Recomments", id as string));
      });
    });

    const postImgId = post.img?.map((item) => {
      if (
        item !==
          "https://mblogthumb-phinf.pstatic.net/MjAxODAxMDhfMTI0/MDAxNTE1MzM4MzgyOTgw.JGPYfKZh1Zq15968iGm6eAepu5T4x-9LEAq_0aRSPSsg.vlICAPGyOq_JDoJWSj4iVuh9SHA6wYbLFBK8oQRE8xAg.JPEG.aflashofhope/%EC%86%8C%EC%A3%BC.jpg?type=w800" &&
        item !==
          "https://steptohealth.co.kr/wp-content/uploads/2016/08/9-benefits-from-drinking-beer-in-moderation.jpg?auto=webp&quality=45&width=1920&crop=16:9,smart,safe" &&
        item !==
          "http://i.fltcdn.net/contents/3285/original_1475799965087_vijbl1k0529.jpeg" &&
        item !== "https://t1.daumcdn.net/cfile/tistory/1526D4524E0160C330"
      ) {
        return item.split("2F")[1].split("?")[0];
      } else {
        return null;
      }
    });

    postImgId?.map(async (item) => {
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
        setPost({
          ...post,
          like: post?.like!.filter(
            (prev) => prev !== authService.currentUser?.uid
          ),
        });
      } else {
        await updateDoc(doc(dbService, "Posts", id), {
          like: [...post?.like!, authService.currentUser?.uid],
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

    if (authService.currentUser?.uid) {
      if (pastPost.reporter) {
        if (pastPost.reporter.includes(authService.currentUser?.uid)) {
          alert("이미 신고한 게시물입니다.");
          return;
        } else {
          pastPost.reporter.push(authService.currentUser?.uid);
          await updateDoc(doc(dbService, "ReportPosts", postId), {
            reporter: pastPost.reporter,
          });
          alert("새로운 신고자!");
        }
      } else if (!pastPost.reporter) {
        const newPost = {
          ...post,
          reporter: [authService.currentUser?.uid],
        };
        await setDoc(doc(dbService, "ReportPosts", postId), newPost);
        alert("신고 완료");
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

  useEffect(() => {
    if (authService.currentUser) {
      updateUserRecently();
    }

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
          <span className="text-textBlack">{post.type}</span>
        </div>
        <div
          id="post-detail"
          className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:space-x-10 mb-32"
        >
          <div id="images-column" className="hidden sm:block sm:w-2/5 w-full">
            <Image
              width={100}
              height={100}
              alt=""
              src={post.img === null ? "" : post.img![imgIdx]}
              className="w-full aspect-square object-cover rounded"
            />
            <div className="mt-6 grid grid-cols-3 gap-6 items-center w-full">
              {post.img?.map((img, i) => (
                <button
                  key={uuidv4()}
                  className={`${
                    img === post.img![imgIdx]
                      ? "border-2 border-primary"
                      : "border-0"
                  } w-full aspect-square object-cover rounded overflow-hidden`}
                  onClick={() => onImgChange(i)}
                >
                  <Image
                    width={100}
                    height={100}
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
              {post.img?.map((img) => (
                <div key={uuidv4()} className="w-full">
                  <SwiperSlide>
                    {img && (
                      <Image
                        src={img}
                        width={100}
                        height={100}
                        alt=""
                        className="w-full aspect-[4/3] object-cover"
                      />
                    )}
                  </SwiperSlide>
                </div>
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
                  {post.title}
                </h4>
                <span className="block py-1 px-5 rounded-full text-xs sm:text-sm text-primary bg-second">
                  {post.type}
                </span>
              </div>
              <div className="flex justify-end items-start space-x-2">
                <div className="flex flex-col items-center">
                  <button onClick={() => postLike(postId as string)}>
                    {likedUser ? (
                      <FaHeart className="text-primary" size={24} />
                    ) : (
                      <FiHeart className="text-primary" size={24} />
                    )}
                  </button>
                  <span className="text-textGray text-xs">
                    {post.like!.length}
                  </span>
                </div>
                {authService.currentUser?.uid === post.userId && (
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
                          onClick={deleteToggle}
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
            {deleteConfirm && (
              <DeleteModal
                deletePost={deletePost}
                setDeleteConfirm={setDeleteConfirm}
                id={postId}
                text="게시물"
                content="삭제한 게시물은 복원이 불가합니다."
              />
            )}
            <div id="post-user" className="flex items-start space-x-6 mt-7">
              <div className="flex flex-col items-center justify-start space-y-2 lg:w-[25%] w-[30%]">
                <Link href={`/users/${user.userId}`}>
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={user?.imageURL as string}
                    className="w-12 sm:w-20 aspect-square bg-slate-300 rounded-full object-cover"
                  />
                </Link>
                <Link
                  href={`/users/${post.userId}`}
                  className="flex justify-center items-center"
                >
                  <span className="font-bold mr-1 text-xs sm:text-sm lg:text-base">
                    {user?.nickname}
                  </span>
                  <span className="w-[10px] sm:w-[12px]">
                    <Grade score={user.point!} />
                  </span>
                </Link>
              </div>
              <div className="w-full pt-1">
                <pre className="whitespace-pre-wrap break-all text-xs sm:text-base">
                  {post.text}
                </pre>
              </div>
            </div>
            <div id="ingredient" className="mt-10 mb-9">
              <span className="inline-block py-1.5 px-5 sm:px-7 sm:py-2 bg-primary text-white lg:text-xl text-sm rounded-full">
                준비물
              </span>
              <div className="pt-6 flex justify-start flex-wrap">
                {post.ingredient?.map((ing, i) => (
                  <button
                    key={uuidv4()}
                    onClick={() => {
                      router.push(`/search/include/${ing}`);
                    }}
                    className="inline-block mr-6 mb-6 py-1.5 px-4 sm:px-6 rounded-full border border-gray-700 cursor-pointer hover:text-textGray transition text-xs sm:text-base"
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
                {post.recipe}
              </pre>
            </div>
            {authService.currentUser?.uid !== post.userId && (
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

export const getServerSideProps: GetServerSideProps = async ({
  params: { postId },
}: any) => {
  const docRef = doc(dbService, "Posts", postId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const newPost = {
    ...data,
  };

  const userRef = doc(dbService, "Users", newPost?.userId! as string);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const newUser = {
    ...userData,
  };

  return {
    props: { postId, newPost, newUser },
  };
};
