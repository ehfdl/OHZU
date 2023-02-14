import { dbService } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

interface CommentProps {
  comment: CommentType;
}

const CommentList = ({ comment }: CommentProps) => {
  const editComment = async (id: string, edit: any) => {
    await updateDoc(doc(dbService, "Comments", id), edit);
  };

  const deleteComment = async (id: string) => {
    await deleteDoc(doc(dbService, "Comments", id));
  };

  const { content, createdAt } = comment;

  // const { isLoading: isLoadingDeteting, mutate: deleteComment } = useMutation(
  //   ["deleteComment", comment.id],
  //   (body) => deleteComment(body),
  //   {
  //     onSuccess: () => {
  //       console.log("comment update");
  //     },
  //     onError: (err) => {
  //       console.log("err in update comment:", err);
  //     },
  //   }
  // );

  return (
    <li className="flex justify-between py-6">
      <div className="flex space-x-5">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-slate-300 w-[40px] aspect-square rounded-full" />
          <span className="text-xs">닉네임</span>
        </div>
        <div className="space-y-2 flex flex-col justify-between">
          <pre>{content}</pre>
          <span className="text-xs text-gray-500">{createdAt}</span>
        </div>
      </div>
      <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/4">
        <button>신고</button>
        <button>답글달기</button>
      </div>
    </li>
  );
};

export default CommentList;
