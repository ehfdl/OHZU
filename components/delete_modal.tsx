import React, { Dispatch, SetStateAction, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DeleteModalProps {
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteComment?: (id: string) => Promise<void>;
  deletePost?: (id: string) => Promise<void>;
  id: string | undefined;
  text: string;
}

const DeleteModal = ({
  setDeleteConfirm,
  deleteComment,
  deletePost,
  id,
  text,
}: DeleteModalProps) => {
  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="relative w-5/6 md:w-4/5 lg:w-3/5  xl:w-2/5 2xl:w-2/6 aspect-vedio bg-white flex flex-col justify-center items-center p-20 space-y-16">
        <h2 className="font-bold text-3xl">{text}을 삭제하시겠어요?</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quisquam
          itaque saepe esse laudantium.
        </p>
        <div className="flex flex-col space-y-6">
          {text === "댓글" ? (
            <button
              className="py-3 px-40 bg-black text-white"
              onClick={() => deleteComment!(id!)}
            >
              삭제
            </button>
          ) : text === "게시글" ? (
            <button
              className="py-3 px-40 bg-black text-white"
              onClick={() => deletePost!(id!)}
            >
              삭제
            </button>
          ) : null}
          <button
            className="py-3 px-40 bg-black text-white"
            onClick={() => setDeleteConfirm(false)}
          >
            취소
          </button>
        </div>
        <button
          onClick={() => setDeleteConfirm(false)}
          className="absolute top-0 right-0 !mt-0 p-7"
        >
          <AiOutlineClose size={40} />
        </button>
      </div>
    </div>
  );
};
export default DeleteModal;
