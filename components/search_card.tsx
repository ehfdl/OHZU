import React from "react";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { authService, dbService } from "@/firebase";

export const SearchCard = ({ card }: any) => {
  const like = card.item.like?.includes(authService.currentUser?.uid);

  const onClickLikeBtn = async () => {
    if (!authService.currentUser?.uid) {
      alert("로그인이 필요한 서비스입니다.");
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
    <div
      key={card.item.postId}
      className="card max-w-[384px] w-full h-[420px] mb-6 bg-[#fafafa] rounded  row-span-[1] relative"
    >
      <Link href={`/post/${card.item.postId}`}>
        <img
          className=" w-[384px] h-[284px] rounded-t bg-contain  object-cover"
          src={card.item.img[0]}
        />
        <div className=" bg-black/0 w-[384px] h-[284px] object-cover absolute top-0 hover:bg-gray-300/30 hover:block"></div>
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
              <img
                src="/like/like-pressed.png"
                className="w-[18px] h-4 m-auto"
              />
            ) : (
              <img
                src="/like/like-default.png"
                className="w-[18px] h-4 m-auto"
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
  );
};
