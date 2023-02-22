import React from "react";

const ReportPostCard = ({ post }: { post: ReportPost }) => {
  return (
    <div key={post.id} className="border-b-2 border-iconDefault py-2 px-2">
      <div>카드아이디 : {post.id}</div>
      <div>신고횟수 : {post.reporter?.length}</div>
      <div>이미지 </div>
      <div>제목 : {post.title}</div>
      <div>소개 : {post.text}</div>
      <div>재료 : {post.ingredient?.length}</div>
      <div>방법 : {post.recipe}</div>
      <div className="cursor-pointer bg-slate-400 text-center mt-3">삭제</div>
    </div>
  );
};

export default ReportPostCard;
