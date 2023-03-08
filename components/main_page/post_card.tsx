import { authService, dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Grade from "../grade";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import { ETC_IMG } from "@/util";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";

const PostCard = ({ post, type }: { post: any; type?: string }) => {
  const defaultImg = ETC_IMG;
  const { showModal } = useModal();

  const { isLoading: isLoadingPost, mutate: updatePost } = useUpdatePost(
    post.postId
  );

  const like = post.like.includes(authService.currentUser?.uid);
  const onClickLikeBtn = async () => {
    if (!authService.currentUser?.uid) {
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

      return true;
    }
    const likeArray = post.like.includes(authService.currentUser?.uid);

    if (likeArray) {
      const newLikeArray = post.like.filter(
        (id: any) => id !== authService.currentUser?.uid
      );

      await updatePost({
        postId: post.postId,
        editPostObj: {
          like: newLikeArray,
        },
      });
    } else if (!likeArray) {
      const newLikeArray = post.like.push(authService.currentUser?.uid);
      await updatePost({
        postId: post.postId,
        editPostObj: {
          like: post.like,
        },
      });
    } else if (authService.currentUser?.uid === null) {
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

  let docId: string;
  if (typeof window !== "undefined") {
    docId = window.location.pathname.substring(6);
  }
  const [user, setUser] = useState<UserType>({
    userId: "",
    email: "",
    nickname: "",
    imageURL: "",
    point: 0,
  });

  const getUser = async () => {
    if (post?.userId) {
      const userRef = doc(dbService, "Users", post?.userId! as string);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userProfile = {
        ...userData,
      };

      setUser(userProfile);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="relative w-full ">
      <div
        className={`flex ${type === "like" ? "scale-90" : null} sm:scale-100`}
      >
        <div
          key={post.postId}
          className="sm:mt-1 w-full sm:aspect-[1/1.09375] aspect-[1/1.59649123] "
        >
          <div className="w-full sm:aspect-[1.35211268/1] aspect-[1.01785714/1] ">
            <Link
              aria-label={`${post.title}-img`}
              href={{
                pathname: `/post/${post.title.replaceAll(" ", "_")}`,
                query: {
                  postId: post.postId,
                },
              }}
              as={`/post/${post.title.replaceAll(" ", "_")}`}
            >
              <Image
                src={post.img[0] || defaultImg}
                className="w-full  aspect-[1.01785714/1] sm:aspect-[1.35211268/1] object-cover rounded border-[1px] border-borderGray"
                alt=""
                width={300}
                height={300}
              />
              {/* <div className=" bg-black/0 max-w-[384px] w-full h-[284px] object-cover absolute top-0 left-1 hover:bg-gray-300/30 hover:block"></div> */}
            </Link>
          </div>
          <div className="sm:aspect-[2.82352941/1] aspect-[1.62857143/1] w-full bg-white mb-6 ">
            <div>
              <div className="sm:group">
                <Link
                  aria-label={post.title}
                  href={{
                    pathname: `/post/${post.title.replaceAll(" ", "_")}`,
                    query: {
                      postId: post.postId,
                    },
                  }}
                  as={`/post/${post.title.replaceAll(" ", "_")}`}
                >
                  <div className="sm:float-left mt-3 sm:mt-2 ml-[1px] text-start sm:ml-[70px] sm:translate-y-[12px] float-none sm:text-[22px] text-base font-bold sm:w-[150px]">
                    {post.title}
                  </div>
                </Link>
                <div
                  onClick={onClickLikeBtn}
                  className="hidden sm:block flex-col right-0 top float-right w-4 h-4 items-center sm:w-[20px] sm:h-[16px] sm:z-[5] cursor-pointer "
                >
                  {like ? (
                    <Image
                      alt=""
                      src="/like/like-pressed.png"
                      width={18}
                      height={23}
                    />
                  ) : (
                    <Image
                      alt=""
                      src="/like/like-default.png"
                      width={18}
                      height={23}
                    />
                  )}
                  <div className="ml-[6px] sm:text-[rgba(87,86,86,0.5)] text-[11px] text-white">
                    {post.like.length}
                  </div>
                </div>
              </div>
              <div className="sm:mt-5 sm:ml-3 flex items-center w-full mt-2">
                {post.userId === authService.currentUser?.uid ? (
                  <Link aria-label="mypage" href="/mypage">
                    <div>
                      {user.imageURL && (
                        <Image
                          className="sm:w-11 float-left sm:float-none sm:h-11 w-6 h-6 mt-[-13px] rounded-full sm:mb-2 bg-black cursor-pointer"
                          alt=""
                          src={user.imageURL as string}
                          width={300}
                          height={300}
                        />
                      )}
                    </div>
                  </Link>
                ) : (
                  <Link
                    aria-label="user-page"
                    href={{
                      pathname: `/users/${user?.nickname?.replaceAll(
                        " ",
                        "_"
                      )}`,
                      query: {
                        userId: post.userId,
                      },
                    }}
                    as={`/users/${user?.nickname?.replaceAll(" ", "_")}`}
                  >
                    <div>
                      {user.imageURL && (
                        <Image
                          className="sm:w-11 float-left sm:float-none sm:h-11 w-6 h-6 mt-[-13px] rounded-full sm:mb-2 bg-black cursor-pointe "
                          alt=""
                          src={user.imageURL as string}
                          width={100}
                          height={100}
                        />
                      )}
                    </div>
                  </Link>
                )}

                <div className="mb-2">
                  <div className="sm:text-sm text-[14px]" key={user.userId}>
                    <p className="sm:float-left float-left ml-[8px] sm:mt-[18px] sm:ml-[14px] text-black leading-none -translate-y-[1px]">
                      {user?.nickname}
                    </p>
                    <span className="sm:float-left float-left w-[11px] h-[14px] sm:mt-[18px]  sm:w-[11px] sm:h-[14px] ml-1 -translate-y-[2px] sm:-translate-y-[2px]">
                      <Grade score={user?.point as number} />
                    </span>
                  </div>
                </div>

                <div
                  onClick={onClickLikeBtn}
                  className="absolute flex flex-col float-right w-4 h-4 sm:hidden right-4 top-4 items-center sm:w-[20px] sm:h-[16px] sm:z-[5] sm:mr-6 sm:mt-4 sm:mb-3 cursor-pointer"
                >
                  {like ? (
                    <Image
                      alt=""
                      src="/like/like-pressed.png"
                      width={18}
                      height={23}
                    />
                  ) : (
                    <Image
                      alt=""
                      src="/like/like-default.png"
                      width={18}
                      height={23}
                    />
                  )}
                  <div className="sm:text-[rgba(87,86,86,0.5)] text-[11px] text-white">
                    {post.like.length}
                  </div>
                </div>
              </div>

              {/* <div
                onClick={onClickLikeBtn}
                className="hidden sm:block flex-col float-right w-4 h-4 items-center sm:w-[20px] sm:h-[16px] sm:z-[5] cursor-pointer "
              >
                {like ? (
                  <Image
                    alt=""
                    src="/like/like-pressed.png"
                    width={18}
                    height={23}
                  />
                ) : (
                  <Image
                    alt=""
                    src="/like/like-default.png"
                    width={18}
                    height={23}
                  />
                )}
                <div className="ml-[6px] sm:text-[rgba(87,86,86,0.5)] text-[11px] text-white">
                  {post.like.length}
                </div>
              </div> */}
            </div>
            <div className="text-sm mx-[0.5px] text-[#8E8E93] sm:text-sm sm:mx-[13px] sm:mt-1 sm:mb-2 sm:w-[345px] sm:line-clamp-3 line-clamp-2 text-ellipsis break-all font-normal">
              {post.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
