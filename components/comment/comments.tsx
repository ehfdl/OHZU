import { authService, dbService } from "@/firebase";
import useCreateComment from "@/hooks/query/comment/useCreateComment";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";
import useModal from "@/hooks/useModal";
import { doc, getDoc } from "firebase/firestore";
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
  const initialComment = {
    content: "",
    postId: "",
    userId: "",
    createdAt: date,
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
    const textareaLineHeight = 26;
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
      createdAt: date,
      isEdit: false,
    };
    const newAlarm = {
      content: comment.content,
      postId: postId,
      nickname: currentUser?.nickname,
      title: post?.title,
      type: "댓글",
      createdAt: date,
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
    <div id="comments" className="max-w-[768px] w-full mx-auto mb-10">
      <div className="font-medium space-x-2 px-2 mx-4 sm:px-4 sm:mx-0 sm:text-xl ">
        <span>댓글</span>
        <span>{comments?.length}</span>
      </div>
      <div className="h-[1px] bg-black mt-2.5 mb-4 mx-4 sm:mx-0" />
      <form className="w-full flex items-center relative space-x-6 px-4">
        {currentUser?.imageURL && (
          <Image
            width={48}
            height={48}
            alt=""
            src={currentUser?.imageURL}
            className="w-[36px] sm:w-[45px] aspect-square rounded-full object-cover border-borderGray"
          />
        )}
        <textarea
          disabled={authService.currentUser ? false : true}
          name="content"
          value={comment.content}
          onChange={handleChange}
          className="w-full pl-4 pr-12 py-3.5 rounded border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none text-sm"
          placeholder="댓글을 입력해주세요."
          rows={resizeTextArea.rows}
        />
        <button
          aria-label="add-comment"
          disabled={authService.currentUser ? false : true}
          onClick={addComment}
          className="absolute right-8 disabled:text-gray-400"
        >
          <span className="text-sm font-bold text-phGray hover:text-black">
            등록
          </span>
        </button>
      </form>

      <ul id="comment-list" className="mt-2.5 mb-6 w-full">
        {comments?.slice(offset, offset + limit).map((comment) => (
          <CommentList
            key={comment.id}
            comment={comment}
            currentUser={currentUser!}
            postTitle={post?.title!}
          />
        ))}
      </ul>
      {comments?.length !== 0 && (
        <nav className="w-full flex justify-center items-center space-x-9">
          <button
            aria-label="prev"
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
                aria-label="page-number"
                className="text-gray-400"
                key={i}
                onClick={() => setPage(i + 1)}
                aria-current={page === i + 1 ? "page" : false}
              >
                {i + 1}
              </button>
            ))}
          <button
            aria-label="next"
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
