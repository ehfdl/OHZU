import React, { Dispatch, SetStateAction, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DeleteModalProps {
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteComment?: (id: string) => Promise<void>;
  deletePost?: (id: string) => Promise<void>;
  deleteRecomment?: (id: string) => Promise<void>;
  id: string | undefined;
  text: string;
}

const DeleteModal = ({
  setDeleteConfirm,
  deleteComment,
  deletePost,
  deleteRecomment,
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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="relative w-[590px] aspect-[4/3] bg-white flex flex-col justify-center items-center px-12 py-20">
        <h2 className="font-bold text-3xl">{text}을 삭제하시겠어요?</h2>
        <p className="text-2xl font-light text-center my-12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quisquam
          itaque saepe esse laudantium.
        </p>
        <div className="flex justify-between space-x-5">
          <button
            className="py-3 px-24 border border-primary text-primary rounded"
            onClick={() => setDeleteConfirm(false)}
          >
            취소
          </button>
          {text === "댓글" ? (
            <button
              className="py-3 px-24 bg-primary text-white rounded"
              onClick={() => deleteComment!(id!)}
            >
              삭제
            </button>
          ) : text === "게시글" ? (
            <button
              className="py-3 px-24 bg-primary text-white rounded"
              onClick={() => deletePost!(id!)}
            >
              삭제
            </button>
          ) : text === "답글" ? (
            <button
              className="py-3 px-24 bg-primary text-white rounded"
              onClick={() => deleteRecomment!(id!)}
            >
              삭제
            </button>
          ) : null}
        </div>
        <button
          onClick={() => setDeleteConfirm(false)}
          className="absolute top-0 right-0 !mt-0 p-8"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};
export default DeleteModal;
