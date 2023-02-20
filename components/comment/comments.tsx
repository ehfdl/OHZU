import { authService, dbService } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CommentList from "./comment_list";

interface CommentsProps {
  postId: string;
  comments: CommentType[];
  currentUser: UserType;
}
const Comments = ({ postId, comments, currentUser }: CommentsProps) => {
  const date = new Date();
  const dateForm = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(date);
  const initialComment = {
    content: "",
    postId: "",
    userId: "",
    createdAt: "",
    isEdit: false,
  };

  const [comment, setComment] = useState<CommentType>(initialComment);

  // pagination State
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * limit;
  const total = comments.length;
  const pagesNumber = Math.ceil(total / limit);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setComment({
      ...comment,
      [name]: value,
    });
  };

  const addComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newComment = {
      content: comment.content,
      postId: postId,
      userId: currentUser?.userId,
      createdAt: dateForm,
      isEdit: false,
    };
    if (comment.content.trim() !== "") {
      await addDoc(collection(dbService, "Comments"), newComment);
    } else {
      alert("내용이 없습니다!");
    }
    setComment(initialComment);
  };

  return (
    <div id="comments" className="max-w-[768px] w-full mx-auto mt-20">
      <div className="text-xl font-medium space-x-2">
        <span>댓글</span>
        <span>{comments.length}</span>
      </div>
      <div className="h-[1px] w-full bg-black mb-6" />
      <form className="w-full flex items-center relative space-x-6">
        <img
          src={currentUser?.imageURL}
          className="bg-slate-300 w-12 aspect-square rounded-full"
        />
        <textarea
          disabled={authService.currentUser ? false : true}
          name="content"
          value={comment.content}
          onChange={handleChange}
          id=""
          className="w-full p-2 border h-10 resize-none scrollbar-none"
          placeholder="댓글을 입력해주세요."
        />
        <button
          disabled={authService.currentUser ? false : true}
          onClick={addComment}
          className="absolute right-0 pr-4 disabled:text-gray-400"
        >
          <span className="text-sm font-medium">등록</span>
        </button>
      </form>
      <ul id="comment-list" className="mt-10 divide-y-[1px] divide-gray-300">
        {comments?.slice(offset, offset + limit).map((comment) => (
          <CommentList key={comment.id} comment={comment} />
        ))}
      </ul>
      <nav className="w-full flex justify-center items-center space-x-9">
        <button
          className="text-[#FF6161] hover:text-[#D2373F] active:text-[#D2373F] disabled:text-gray-300"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <BsChevronLeft size={20} />
        </button>
        {Array(pagesNumber)
          .fill(pagesNumber)
          .map((_, i) => (
            <button
              className="text-gray-400"
              key={i}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? "page" : false}
            >
              {i + 1}
            </button>
          ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagesNumber}
          className="text-[#FF6161] hover:text-[#D2373F] active:text-[#D2373F] disabled:text-gray-300"
        >
          <BsChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
};
export default Comments;
