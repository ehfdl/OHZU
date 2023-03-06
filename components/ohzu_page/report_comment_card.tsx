import { dbService } from "@/firebase";
import useDeleteReport from "@/hooks/query/reportPost/useDeleteReport";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";

const ReportCommentCard = ({ comment }: { comment: ReportComment }) => {
  const { isLoading: isRemoveReportLoading, mutate: deleteReport } =
    useDeleteReport({ reportId: comment?.commentId as string });
  const deleteComments = async () => {
    // await deleteDoc(
    //   doc(dbService, "ReportComments", comment.commentId as string)
    // );
    deleteReport({
      reportId: comment?.commentId,
      reportType: "ReportComments",
    });
    deleteReport({
      reportId: comment?.commentId,
      reportType: "Comments",
    });
    // await deleteDoc(doc(dbService, "Comments", comment.commentId as string));
  };

  return (
    <div
      key={comment.commentId}
      className="border-b-2 border-iconDefault py-2 px-2"
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
