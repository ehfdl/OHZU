import React from "react";
import Link from "next/link";
import { authService } from "@/firebase";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";

export const SearchCard = ({ card }: any) => {
  const { showModal } = useModal();
  const like = card.item.like?.includes(authService.currentUser?.uid);

  const { isLoading: isLoadingPost, mutate: updatePost } = useUpdatePost(
    card.item.postId
  );
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
    const likeArray = card.item.like?.includes(authService.currentUser?.uid);

    if (likeArray) {
      const newLikeArray = card.item.like.filter(
        (id: any) => id !== authService.currentUser?.uid
      );
      await updatePost({
        postId: card.item.postId,
        editPostObj: {
          like: newLikeArray,
        },
      });
    } else if (!likeArray) {
      const newLikeArray = card.item.like?.push(authService.currentUser?.uid);
      await updatePost({
        postId: card.item.postId,
        editPostObj: {
          like: card.item.like,
        },
      });
    }
  };

  return (
    <>
      {/* 웹 */}
      <div className="hidden sm:block card max-w-[384px] w-full h-[420px] mb-6 rounded row-span-[1] relative">
        <Link
          aria-label={`${card.item.title}-img`}
          href={{
            pathname: `/post/${card.item.title.replaceAll(" ", "_")}`,
            query: {
              postId: card.item.postId,
            },
          }}
          as={`/post/${card.item.title.replaceAll(" ", "_")}`}
        >
          <Image
            className="max-w-[384px] w-full max-h-[284px] h-full rounded border-[1px] border-borderGray object-cover"
            src={card.item.img[0]}
            width={350}
            height={350}
            alt="검색 음료 사진"
          />
          <div className=" bg-black/0 max-w-[384px] w-full h-[284px] object-cover absolute top-0 hover:bg-gray-300/30 hover:block"></div>
        </Link>

        <div className="card-contents flex items-center px-5 mt-4 relative mb-4">
          <div className="contents-header-wrap flex justify-around ">
            <div className="flex flex-col">
              <Link
                aria-label={card.item.title}
                href={{
                  pathname: `/post/${card.item.title.replaceAll(" ", "_")}`,
                  query: {
                    postId: card.item.postId,
                  },
                }}
                as={`/post/${card.item.title.replaceAll(" ", "_")}`}
              >
                <h1 className="text-[22px] font-bold">{card.item.title}</h1>
              </Link>
            </div>

            <div
              className="absolute top-2 right-5 cursor-pointer"
              onClick={onClickLikeBtn}
            >
              {like ? (
                <Image
                  src="/like/like-pressed.png"
                  width="18"
                  height="16"
                  alt="좋아요"
                  className="cursor-pointer text-center"
                />
              ) : (
                <Image
                  src="/like/like-default.png"
                  width="18"
                  height="16"
                  alt="아직 안 좋아요"
                  className="cursor-pointer text-center"
                />
              )}

              <p className=" text-xs text-center  text-textGray ">
                {card.item.like.length}
              </p>
            </div>
          </div>
        </div>
        <p className=" text-[14px] max-w-[384px] w-full h-[45px] px-5 overflow-hidden break-words">
          {card.item?.ingredient.map((tag: any, i: number) => (
            <Link aria-label={tag} href={`/search/include/${tag}`} key={i}>
              <span className="mr-[10px] text-[14px] font-normal text-textGray">
                {"#" + tag}
              </span>
            </Link>
          ))}
        </p>
      </div>

      {/* 모바일 */}
      <div className="sm:hidden card max-w-[171px] w-full  mb-6  rounded row-span-[1] relative">
        <div
          className="w-8 h-8 absolute top-[14px] right-[15.5px] cursor-pointer flex flex-col justify-center items-center z-1"
          onClick={onClickLikeBtn}
        >
          {like ? (
            <Image
              src="/like/like-pressed.png"
              width="18"
              height="16"
              alt="좋아요"
              className="cursor-pointer text-center "
            />
          ) : (
            <Image
              src="/like/like-default.png"
              width="18"
              height="16"
              alt="아직 안 좋아요"
              className="cursor-pointer text-center"
            />
          )}

          <p className=" text-xs text-center  text-[#f0f0f0] ">
            {card.item.like.length}
          </p>
        </div>
        <Link
          aria-label={`${card.item.title}-img`}
          href={{
            pathname: `/post/${card.item.title.replaceAll(" ", "_")}`,
            query: {
              postId: card.item.postId,
            },
          }}
          as={`/post/${card.item.title.replaceAll(" ", "_")}`}
        >
          <Image
            className="w-[171px] h-[168px]  cursor-pointer rounded border-[1px] border-borderGray  object-cover"
            src={card.item.img[0]}
            width={200}
            height={200}
            alt="검색 음료 사진"
          />
        </Link>

        <div className="card-contents flex items-center mt-3  relative mb-1">
          <div className="contents-header-wrap flex justify-around ">
            <div className="flex flex-col">
              <Link
                aria-label={card.item.title}
                href={{
                  pathname: `/post/${card.item.title.replaceAll(" ", "_")}`,
                  query: {
                    postId: card.item.postId,
                  },
                }}
                as={`/post/${card.item.title.replaceAll(" ", "_")}`}
              >
                <h1 className=" font-semibold">{card.item.title}</h1>
              </Link>
            </div>
          </div>
        </div>
        <p className=" text-sm w-full min-h-[60px] h-full  overflow-hidden break-words">
          {card.item?.ingredient.map((tag: any, i: number) => (
            <Link aria-label={tag} href={`/search/include/${tag}`} key={i}>
              <span className="mr-[10px] text-xs font-normal text-textGray">
                {"#" + tag}
              </span>
            </Link>
          ))}
        </p>
      </div>
    </>
  );
};
