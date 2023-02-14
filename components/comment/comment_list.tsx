import { authService, dbService } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import DeleteModal from "./comment_delete_modal";

interface CommentProps {
  comment: CommentType;
}

const CommentList = ({ comment }: CommentProps) => {
  const { content, createdAt, userId, id, isEdit } = comment;

  const [editContent, setEditComment] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const editToggle = async () => {
    await updateDoc(doc(dbService, "Comments", id as string), {
      isEdit: !isEdit,
    });
  };

  const editComment = async (id: string, edit: any) => {
    await updateDoc(doc(dbService, "Comments", id), {
      ...comment,
      content: edit,
    });
    await updateDoc(doc(dbService, "Comments", id as string), {
      isEdit: !isEdit,
    });
    setEditComment("");
  };

  const deleteToggle = () => {
    setDeleteConfirm(!deleteConfirm);
  };

  const deleteComment = async (id: string) => {
    await deleteDoc(doc(dbService, "Comments", id));
  };

  // const { isLoading: isLoadingDeteting, mutate: deleteComment } = useMutation(
  //   ["deleteComment", comment.id],
  //   (body) => deleteComment(body),
  //   {
  //     onSuccess: () => {
  //       console.log("Deleted Comment");
  //     },
  //     onError: (err) => {
  //       console.log("err in delete comment:", err);
  //     },
  //   }
  // );

  const resetToggle = async () => {
    await updateDoc(doc(dbService, "Comments", id as string), {
      isEdit: false,
    });
    setDeleteConfirm(false);
  };

  useEffect(() => {
    resetToggle();
    return;
  }, []);

  return (
    <li className="flex justify-between py-6">
      <div className="flex space-x-6 w-full">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-slate-300 w-[40px] aspect-square rounded-full" />
          <span className="text-xs">닉네임</span>
        </div>
        <div className="space-y-2 flex flex-col justify-between w-full">
          {isEdit ? (
            <div className="w-full flex items-center relative space-x-6">
              <textarea
                name="editContent"
                value={editContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setEditComment(e.target.value);
                }}
                className="w-full p-2 border h-10 resize-none placeholder:text-sm"
                placeholder={content}
              />
              <div className="absolute right-0 pr-4 space-x-2">
                <button onClick={editToggle}>
                  <span className="text-sm font-medium">취소</span>
                </button>
                <button onClick={() => editComment(id as string, editContent)}>
                  <span className="text-sm font-medium">등록</span>
                </button>
              </div>
            </div>
          ) : (
            <pre>{content}</pre>
          )}

          <span className="text-xs text-gray-500">{createdAt}</span>
        </div>
      </div>
      {authService.currentUser?.uid === userId ? (
        <div
          className={`${
            isEdit ? "hidden" : "flex"
          } flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/6`}
        >
          <button onClick={editToggle}>수정</button>
          {/* <button onClick={() => deleteComment(id as string)}>삭제</button> */}
          <button onClick={deleteToggle}>삭제</button>
        </div>
      ) : (
        <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/6">
          <button>신고</button>
          <button>답글달기</button>
        </div>
      )}
      {deleteConfirm && (
        <DeleteModal
          deleteComment={deleteComment}
          setDeleteConfirm={setDeleteConfirm}
          id={id}
        />
      )}
    </li>
  );
};

export default CommentList;
