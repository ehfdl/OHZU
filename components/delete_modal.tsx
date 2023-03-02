import React, { useEffect } from "react";
import { CgClose } from "react-icons/cg";

interface DeleteModalProps {
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteComment?: (id: string) => Promise<void>;
  deletePost?: (id: string) => Promise<void>;
  deleteRecomment?: (id: string) => Promise<void>;
  id: string | undefined;
  text: string;
  content: string;
}

const DeleteModal = ({
  setDeleteConfirm,
  deleteComment,
  deletePost,
  deleteRecomment,
  id,
  text,
  content,
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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10">
      <div className="relative w-[90%] sm:w-[590px] bg-white flex flex-col justify-center items-center rounded pt-8 pb-12 px-16 sm:px-12 sm:py-16">
        <h2 className="font-bold sm:text-3xl">{text}을 삭제하시겠어요?</h2>
        <p className="text-center text-sm sm:text-base text-textGray mt-6 mb-11">
          {content}
        </p>
        <div className="absolute bottom-0 left-0 sm:static flex justify-center sm:space-x-5 w-full">
          <button
            className="py-3.5 sm:px-24 w-full sm:w-auto border-t border-r sm:border border-primary text-primary sm:rounded"
            onClick={() => setDeleteConfirm(false)}
          >
            취소
          </button>
          {text === "댓글" ? (
            <button
              className="py-3.5 sm:px-24 w-full sm:w-auto bg-primary text-white sm:rounded"
              onClick={() => deleteComment!(id!)}
            >
              삭제
            </button>
          ) : text === "게시물" ? (
            <button
              className="py-3.5 sm:px-24 w-full sm:w-auto bg-primary text-white sm:rounded"
              onClick={() => deletePost!(id!)}
            >
              삭제
            </button>
          ) : text === "답글" ? (
            <button
              className="py-3.5 sm:px-24 w-full sm:w-auto bg-primary text-white sm:rounded"
              onClick={() => deleteRecomment!(id!)}
            >
              삭제
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
