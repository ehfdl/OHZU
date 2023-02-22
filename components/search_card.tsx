import React from "react";
import Link from "next/link";

export const SearchCard = ({ card }: any) => {
  return (
    <Link href={`/post/${card.item.postId}`}>
      <div
        key={card.item.postId}
        className="card max-w-[384px] w-full h-[420px] mb-6 bg-[#fafafa] rounded  row-span-[1]"
      >
        <img
          className=" w-[384px] h-[284px] rounded-t bg-contain"
          src={card.item.img[0]}
        />
        <div className="card-contents flex items-center mt-4 px-[30px] relative mb-[14px]">
          <div className="contents-header-wrap flex justify-around ">
            <div className="flex flex-col">
              <h1 className="text-[22px] font-semibold">{card.item.title}</h1>
              {/* <p className="text-[14px]">
                {card.item.nickname ? card.item.nickname : "아무개"}
              </p> */}
            </div>

            <div className="w-[18px] h-4 absolute top-2 right-5">
              <img src="/like/like-default.png" />
            </div>
          </div>
        </div>
        <p className=" text-[14px] max-w-[384px] w-full h-[45px]  px-4 overflow-hidden text-ellipsis-2">
          #{card.item?.ingredient}
        </p>
      </div>
    </Link>
  );
};
