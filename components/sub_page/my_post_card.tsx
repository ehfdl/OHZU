import { authService } from "@/firebase";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ETC_IMG } from "@/util";

const MyPostCard = ({ post }: { post: any }) => {
  const defaultImg = ETC_IMG;

  const { isLoading: isLoadingPost, mutate: updatePost } = useUpdatePost(
    post.postId
  );

  const like = post.like.includes(authService.currentUser?.uid);

  const onClickLikeBtn = async () => {
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
    }
  };

  return (
    <div
      key={post.postId}
      className="aspect-square sm:aspect-[4/2.6945169712793735] bg-slate-200 overflow-hidden relative rounded border-[1px] border-borderGray"
    >
      <Link
        aria-label={post.title}
        href={{
          pathname: `/post/${post.title?.replaceAll(" ", "_")}`,
          query: {
            postId: post.postId,
          },
        }}
        as={`/post/${post.title?.replaceAll(" ", "_")}`}
      >
        <div className="w-full sm:h-[92px] h-[60px] bg-gradient-to-t bottom-0 sm:top-0 sm:bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>
        <div className="absolute flex flex-col gap-[2px] sm:gap-1 pb-3 sm:pt-6 pl-3 bottom-0 sm:top-0 sm:pl-8 ">
          <div className="text-white font-bold text-[14px] sm:text-[24px]">
            {post.title}
          </div>
          <div className="text-[10px] sm:text-[12px] bg-white/80 sm:bg-white/50 py-[2px] sm:py-1 text-[#333333] w-10 sm:w-[58px] flex justify-center  rounded-[20px]">
            {post.type}
          </div>
        </div>
      </Link>
      <div
        onClick={onClickLikeBtn}
        className="absolute flex flex-col items-center w-7 h-10 z-[5]  right-0 sm:mr-6 mr-3 mt-3 sm:mt-6 cursor-pointer"
      >
        {like ? (
          <Image
            className="w-4 h-[14px] sm:w-6 sm:h-[21px]"
            src="/like/like-pressed.png"
            alt=""
            width={24}
            height={21}
          />
        ) : (
          <Image
            className="w-4 h-[14px] sm:w-6 sm:h-[21px]"
            src="/like/like-default.png"
            alt=""
            width={24}
            height={21}
          />
        )}
        <div className="text-[rgba(255,255,255,0.5)] text-[11px]">
          {post.like.length}
        </div>
      </div>
      <Link
        aria-label={`${post.title}-img`}
        href={{
          pathname: `/post/${post.title?.replaceAll(" ", "_")}`,
          query: {
            postId: post.postId,
          },
        }}
        as={`/post/${post.title?.replaceAll(" ", "_")}`}
      >
        <Image
          src={post.img[0] || defaultImg}
          className="w-full h-full object-cover"
          width={170}
          height={170}
          priority={true}
          alt=""
        />
        <div className=" bg-black/0 w-full h-[284px] object-cover translate-y-[-285px] hover:bg-gray-300/30 hover:block"></div>
      </Link>
    </div>
  );
};

export default MyPostCard;
