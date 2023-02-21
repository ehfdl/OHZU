import { dbService } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";

const ReportCommentCard = ({ comment }: { comment: ReportComment }) => {
  const deleteComments = async () => {
    await deleteDoc(
      doc(dbService, "ReportComments", comment.commentId as string)
    );
    await deleteDoc(doc(dbService, "Comments", comment.commentId as string));
    console.log("삭제됨");
  };

  return (
    <div
      key={comment.commentId}
      className="border-b-2 border-[#cccccc] py-2 px-2"
    >
      <div>카드아이디 : {comment.commentId}</div>
      <div>신고횟수 : {comment.reporter?.length}</div>
      <div> 내용 : {comment.content}</div>
      <div
        onClick={deleteComments}
        className="cursor-pointer bg-slate-400 text-center mt-3"
      >
        삭제
      </div>
    </div>
  );
};

export default ReportCommentCard;
