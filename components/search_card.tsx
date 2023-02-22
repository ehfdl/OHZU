import React from "react";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { authService, dbService } from "@/firebase";

export const SearchCard = ({ card }: any) => {
  console.log("card.item.postId : ", card.item.postId);
  const like = card.item.like?.includes(authService.currentUser?.uid);

  const onClickLikeBtn = async () => {
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
      className="card max-w-[384px] w-full h-[420px] mb-6 bg-[#fafafa] rounded  row-span-[1]"
    >
      <Link href={`/post/${card.item.postId}`}>
        <img
          className=" w-[384px] h-[284px] rounded-t bg-contain"
          src={card.item.img[0]}
        />
      </Link>
      <div className="card-contents flex items-center mt-4 px-[30px] relative mb-4">
        <div className="contents-header-wrap flex justify-around ">
          <div className="flex flex-col">
            <Link href={`/post/${card.item.postId}`}>
              <h1 className="text-[22px] font-semibold">{card.item.title}</h1>
            </Link>
            {/* <p className="text-[14px]">
                {card.item.nickname ? card.item.nickname : "아무개"}
              </p> */}
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
          <Link href={`/search/${tag}`} key={i}>
            <span className="mr-[10px] text-[14px] font-normal text-textGray">
              {"#" + tag}
            </span>
          </Link>
        ))}
      </p>
    </div>
  );
};
