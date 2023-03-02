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

import Link from "next/link";
import Layout from "@/components/layout";
import Grade from "../../components/grade";
import { FiHeart, FiMoreVertical } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { TfiTrash } from "react-icons/tfi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteModal from "@/components/delete_modal";
import { deleteObject, ref } from "firebase/storage";
import { GetServerSideProps } from "next";
import Comments from "@/components/comment/comments";
import { BsShareFill } from "react-icons/bs";
import { RiAlarmWarningLine } from "react-icons/ri";
import { MdOutlineEditNote } from "react-icons/md";
import useModal from "@/hooks/useModal";

interface PostDetailPropsType {
  postId: string;
  newPost: Form;
  newUser: UserType;
}

const PostDetail = ({ postId, newPost, newUser }: PostDetailPropsType) => {
  const router = useRouter();

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
      <div className="sm:max-w-[1200px] mx-auto py-20">
        <div
          id="breadcrumbs"
          className="w-full space-x-2 flex items-center mb-10 text-sm"
        >
          <Link href="/" className="text-textGray">
            홈
          </Link>
          <span className="text-textGray"> &#62; </span>
          <span className="text-textBlack">{post.type}</span>
        </div>
        <div
          id="post-detail"
          className="w-full flex justify-between items-stretch space-x-10 mb-32"
        >
          <div id="images-column" className="w-2/5">
            <img
              src={post.img === null ? "" : post.img![imgIdx]}
              className="w-full aspect-square object-cover rounded"
            />
            <div className="mt-6 grid grid-cols-3 gap-6 items-center w-full">
              {post.img?.map((img, i) => (
                <button
                  key={i}
                  className={`${
                    img === post.img![imgIdx]
                      ? "border-2 border-primary"
                      : "border-0"
                  } w-full aspect-square object-cover rounded overflow-hidden`}
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
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-bold mb-2">{post.title}</h4>
                <span className="block py-1 px-5 rounded-full text-sm text-primary bg-second">
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
                  <span className="text-textGray">{post.like!.length}</span>
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
                        <Link
                          href={`/post/edit/${postId}`}
                          className="flex items-center space-x-5"
                        >
                          <span> 게시글 수정하기</span>{" "}
                          <MdOutlineEditNote size={18} />
                        </Link>
                        <button
                          className="flex items-center space-x-5"
                          onClick={deleteToggle}
                        >
                          <span>게시글 삭제하기</span>
                          <TfiTrash size={18} />
                        </button>
                        <button
                          className="flex items-center space-x-5"
                          onClick={doCopy}
                        >
                          <span>게시글 공유하기</span>
                          <BsShareFill size={18} className="p-0.5" />
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
              <div className="flex flex-col items-center justify-start space-y-2 w-[15%]">
                <Link href={`/users/${user.userId}`}>
                  <img
                    src={user?.imageURL}
                    className="w-20 aspect-square bg-slate-300 rounded-full object-cover"
                  />
                </Link>
                <Link
                  href={`/users/${post.userId}`}
                  className="flex justify-center items-center"
                >
                  <span className="font-bold mr-1">{user?.nickname}</span>
                  <span className="w-[12px]">
                    <Grade score={user.point!} />
                  </span>
                </Link>
              </div>
              <div className="w-4/5 pt-1">
                <pre className="whitespace-pre-wrap break-all">{post.text}</pre>
              </div>
            </div>
            <div id="ingredient" className="mt-10 mb-9">
              <span className="inline-block px-7 py-2 bg-primary text-white text-xl rounded-full">
                준비물
              </span>
              <div className="pt-6 flex justify-start flex-wrap">
                {post.ingredient?.map((ing, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      router.push(`/search/include/${ing}`);
                    }}
                    className="inline-block mr-6 mb-6 py-1.5 px-6 rounded-full border border-gray-700 cursor-pointer hover:text-textGray transition"
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
            <div id="recipe">
              <span className="inline-block px-7 py-2 bg-primary text-white text-xl rounded-full">
                만드는 방법
              </span>
              <pre className="pt-6 whitespace-pre-wrap break-all leading-10 pl-2">
                {post.recipe}
              </pre>
            </div>
            {authService.currentUser?.uid !== post.userId && (
              <div
                id="faq"
                className="absolute right-0 -bottom-16 flex items-start space-x-6"
              >
                <button onClick={doCopy}>
                  <BsShareFill
                    size={24}
                    className="text-iconDefault mt-1 hover:text-primary"
                  />
                </button>
                <button
                  onClick={onClickReportPost}
                  className="flex flex-col items-center space-y-0.5 group"
                >
                  <RiAlarmWarningLine
                    size={24}
                    className="text-iconDefault group-hover:text-primary"
                  />
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
      </div>
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
