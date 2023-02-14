import React, { Dispatch, SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DeleteModalProps {
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteComment: (id: string) => Promise<void>;
  id: string | undefined;
}

const DeleteModal = ({
  setDeleteConfirm,
  deleteComment,
  id,
}: DeleteModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-5/6 md:w-4/5 lg:w-3/5  xl:w-2/5 2xl:w-2/6 aspect-vedio bg-white flex flex-col justify-center items-center p-20 space-y-16">
        <h2 className="font-bold text-3xl">게시글을 삭제하시겠어요?</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quisquam
          itaque saepe esse laudantium.
        </p>
        <div className="flex flex-col space-y-6">
          <button
            className="py-3 px-40 bg-black text-white"
            onClick={() => deleteComment(id!)}
          >
            삭제
          </button>
          <button
            className="py-3 px-40 bg-black text-white"
            onClick={() => setDeleteConfirm(false)}
          >
            취소
          </button>
        </div>
        <button className="absolute top-0 right-0 !mt-0 p-7">
          <AiOutlineClose size={40} />
        </button>
      </div>
    </div>
  );
};
export default DeleteModal;
