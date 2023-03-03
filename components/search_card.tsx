import React from "react";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { authService, dbService } from "@/firebase";
import Image from "next/image";
import useModal from "@/hooks/useModal";

export const SearchCard = ({ card }: any) => {
  const { showModal } = useModal();
  const like = card.item.like?.includes(authService.currentUser?.uid);

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
      await updateDoc(doc(dbService, "Posts", card.item.postId), {
        like: newLikeArray,
      });
    } else if (!likeArray) {
      const newLikeArray = card.item.like?.push(authService.currentUser?.uid);
      await updateDoc(doc(dbService, "Posts", card.item.postId), {
        like: card.item.like,
      });
    }
  };

  return (
    <>
      {/* 웹 */}
      <div
        key={card.item.postId}
        className="hidden sm:block card max-w-[384px] w-full h-[420px] mb-6  rounded  row-span-[1] relative"
      >
        <Link href={`/post/${card.item.postId}`}>
          {/* <img
            className=" max-w-[384px] w-full max-h-[284px] h-full rounded-t bg-contain  object-cover"
            src={card.item.img[0]}
          /> */}
          <Image
            className=" max-w-[384px] w-full max-h-[284px] h-full rounded  object-cover"
            src={card.item.img[0]}
            width="100"
            height="100"
            alt="검색 음료 사진"
          />
          <div className=" bg-black/0 max-w-[384px] w-full h-[284px] object-cover absolute top-0 hover:bg-gray-300/30 hover:block"></div>
        </Link>

        <div className="card-contents flex items-center mt-4 px-[30px] relative mb-4">
          <div className="contents-header-wrap flex justify-around ">
            <div className="flex flex-col">
              <Link href={`/post/${card.item.postId}`}>
                <h1 className="text-[22px] font-bold">{card.item.title}</h1>
              </Link>
            </div>

            <div
              className=" absolute top-2 right-5 cursor-pointer"
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
            {/* </div> */}
          </div>
        </div>
        <p className=" text-[14px] max-w-[384px] w-full h-[45px]  px-5 overflow-hidden break-words">
          {card.item?.ingredient.map((tag: any, i: number) => (
            <Link href={`/search/include/${tag}`} key={i}>
              <span className="mr-[10px] text-[14px] font-normal text-textGray">
                {"#" + tag}
              </span>
            </Link>
          ))}
        </p>
      </div>

      {/* 모바일 */}
      <div
        key={card.item.postId}
        className="sm:hidden card max-w-[171px] w-full  mb-6  rounded row-span-[1] relative"
      >
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

          <p className=" text-xs text-center  text-[#f0f0f0] ">
            {card.item.like.length}
          </p>
        </div>
        <Link href={`/post/${card.item.postId}`}>
          <Image
            className="w-full  w-[171px] h-[168px] w-full h-full cursor-pointer rounded-t bg-contain"
            src={card.item.img[0]}
            width="100"
            height="100"
            alt="검색 음료 사진"
          />
        </Link>

        <div className="card-contents flex items-center mt-3  relative mb-1">
          <div className="contents-header-wrap flex justify-around ">
            <div className="flex flex-col">
              <Link href={`/post/${card.item.postId}`}>
                <h1 className=" font-semibold">{card.item.title}</h1>
              </Link>
            </div>
          </div>
        </div>
        <p className=" text-sm w-full min-h-[45px] h-full  overflow-hidden break-words">
          {card.item?.ingredient.map((tag: any, i: number) => (
            <Link href={`/search/include/${tag}`} key={i}>
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
