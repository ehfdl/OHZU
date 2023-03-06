import { authService, dbService } from "@/firebase";
import useCreateComment from "@/hooks/query/comment/useCreateComment";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";
import useModal from "@/hooks/useModal";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CommentList from "./comment_list";

interface CommentsProps {
  postId?: string;
  comments?: CommentType[];
  currentUser?: UserType;
  user?: UserType;
  post?: Form;
}
const Comments = ({
  postId,
  comments,
  currentUser,
  user,
  post,
}: CommentsProps) => {
  const date = Date.now();
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
    id: "",
    commentId: "",
  };

  const [comment, setComment] = useState<CommentType>(initialComment);
  const { showModal } = useModal();
  // pagination State
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * limit;
  const total = comments?.length;
  const pagesNumber = Math.ceil(total! / limit);

  const [resizeTextArea, setResizeTextArea] = useState({
    rows: 1,
    minRows: 1,
    maxRows: 3,
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const textareaLineHeight = 24;
    const { minRows, maxRows } = resizeTextArea;

    const previousRows = event.target.rows;
    event.target.rows = minRows;

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setResizeTextArea({
      ...resizeTextArea,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
    setComment({
      ...comment,
      [name]: value,
    });
  };

  const { isLoading: isLoadingAddComment, mutate: createComment } =
    useCreateComment();

  const { isLoading: isLoadingEditUser, mutate: updateUser } = useUpdateUser(
    user?.userId as string
  );

  const addComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newComment = {
      content: comment.content.trim(),
      postId: postId,
      userId: authService.currentUser?.uid!,
      createdAt: dateForm,
      isEdit: false,
    };
    const newAlarm = {
      content: comment.content,
      postId: postId,
      nickname: currentUser?.nickname,
      title: post?.title,
      type: "댓글",
      createdAt: Date.now(),
      isDone: false,
    };
    if (comment.content.trim() !== "") {
      createComment(newComment);
      if (post?.userId !== authService.currentUser?.uid) {
        const snapshot = await getDoc(
          doc(dbService, "Users", user?.userId as string)
        );
        const snapshotdata = await snapshot.data();
        const newPost = {
          ...snapshotdata,
        };
        const newA = newPost?.alarm.push(newAlarm);

        // await updateDoc(doc(dbService, "Users", user?.userId as string), {
        //   alarm: newPost?.alarm,
        // });
        updateUser({
          userId: user?.userId,
          editUserObj: {
            alarm: newPost?.alarm,
          },
        });
      }
    } else {
      showModal({
        modalType: "AlertModal",
        modalProps: { title: "내용이 없습니다!" },
      });
    }
    setComment(initialComment);
    setResizeTextArea({
      ...resizeTextArea,
      rows: 1,
    });
  };

  return (
    <div id="comments" className="max-w-[768px] w-full mx-auto">
      <div className="sm:text-xl font-medium space-x-2 mb-4 pl-2 mx-4">
        <span>댓글</span>
        <span>{comments?.length}</span>
      </div>
      <div className="h-[1px] bg-black mb-6 mx-4" />
      <form className="w-full flex items-center relative space-x-4 sm:space-x-6 px-4">
        {currentUser?.imageURL && (
          <Image
            width={48}
            height={48}
            alt=""
            src={currentUser?.imageURL}
            className="bg-slate-300 w-[36px] sm:w-[45px] aspect-square rounded-full object-cover"
          />
        )}
        <textarea
          disabled={authService.currentUser ? false : true}
          name="content"
          value={comment.content}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none text-sm"
          placeholder="댓글을 입력해주세요."
          rows={resizeTextArea.rows}
        />
        <button
          disabled={authService.currentUser ? false : true}
          onClick={addComment}
          className="absolute right-[34px] bottom-3 disabled:text-gray-400"
        >
          <span className="text-sm font-bold text-phGray hover:text-black">
            등록
          </span>
        </button>
      </form>

      <ul id="comment-list" className="mt-4 mb-6">
        {comments?.slice(offset, offset + limit).map((comment) => (
          <CommentList
            key={comment.id}
            comment={comment}
            currentUser={currentUser!}
          />
        ))}
      </ul>
      {comments?.length !== 0 && (
        <nav className="w-full flex justify-center items-center space-x-9">
          <button
            className="text-primary hover:text-hover active:text-hover disabled:text-gray-300"
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
            className="text-primary hover:text-hover active:text-hover disabled:text-gray-300"
          >
            <BsChevronRight size={20} />
          </button>
        </nav>
      )}
    </div>
  );
};
export default Comments;
