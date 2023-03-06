import { authService } from "@/firebase";
import useModal from "@/hooks/useModal";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ETC_IMG } from "@/util";
import useUpdatePost from "@/hooks/query/post/useUpdatePost";

const UserPostCard = ({ post }: { post: any }) => {
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
    }
  };

  return (
    <div
      key={post.postId}
      className=" aspect-square bg-slate-200 overflow-hidden relative rounded"
    >
      <Link href={`/post/${post.postId}`}>
        <div className="w-full h-[60px] sm:h-[180px] bottom-0 sm:top-0 bg-gradient-to-t sm:bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>

        <div className="absolute flex flex-col gap-1  sm:pt-9 sm:pl-9 bottom-0 sm:top-0 pb-3 pl-3 ">
          <div className="text-white font-bold text-sm sm:text-[24px]">
            {post.title}
          </div>
          <div className="text-[10px] sm:text-[12px] bg-white/80 sm:bg-white/50 py-[2px] sm:py-1 text-[#333333] w-10 sm:w-[58px] flex justify-center  rounded-[20px]">
            {post.type}
          </div>
        </div>
      </Link>
      <div
        onClick={onClickLikeBtn}
        className="absolute flex flex-col items-center w-7 h-7 z-[5]  right-0 mr-3 sm:mr-9 mt-[14px] sm:mt-[42px] cursor-pointer"
      >
        {like ? (
          <Image
            className="w-4 h-[14px] sm:w-[27px] sm:h-6"
            src="/like/like-pressed.png"
            alt=""
            width={16}
            height={14}
          />
        ) : (
          <Image
            className="w-4 h-[14px] sm:w-[27px] sm:h-6"
            src="/like/like-default.png"
            alt=""
            width={16}
            height={14}
          />
        )}
        <div className="text-[rgba(255,255,255,0.5)] text-[11px]">
          {post.like.length}
        </div>
      </div>
      <Link href={`/post/${post.postId}`}>
        <Image
          src={post.img[0] || defaultImg}
          className="w-full h-full object-cover border-[1px] border-borderGray"
          alt=""
          width={170}
          height={168}
        />
      </Link>
    </div>
  );
};

export default UserPostCard;
