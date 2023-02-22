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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center !m-0 z-10">
      <div className="relative w-[590px] bg-white flex flex-col justify-center items-center px-12 pt-20 pb-16">
        <h2 className="font-bold text-3xl">{text}을 삭제하시겠어요?</h2>
        <p className="text-center text-textGray mt-6 mb-11">{content}</p>
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
          ) : text === "게시물" ? (
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
          <CgClose size={24} className="text-iconDefault" />
        </button>
      </div>
    </div>
  );
};
export default DeleteModal;
