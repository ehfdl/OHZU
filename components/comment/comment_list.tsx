import { authService, dbService } from "@/firebase";
import useModal from "@/hooks/useModal";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Grade from "../grade";
import Recomments from "./recomments";
import useUpdateComment from "@/hooks/query/comment/useUpdateComment";
import { useGetUser } from "@/hooks/query/user/useGetUser";
import useDeleteComment from "@/hooks/query/comment/useDeleteComment";

interface CommentProps {
  comment: CommentType;
  currentUser: UserType;
}

const CommentList = ({ comment, currentUser }: CommentProps) => {
  const { content, createdAt, userId, id, isEdit, postId } = comment;

  // get User
  const { data: user, isLoading: userLoading } = useGetUser(comment?.userId);

  const [editContent, setEditContent] = useState<string>(content);
  const [isOpen, setIsOpen] = useState(false);
  const [recomments, setRecomments] = useState<CommentType[]>([]);
  const [commentIsEdit, setCommentIsEdit] = useState(false);

  const { showModal, hideModal } = useModal();

  // textarea resize & onChange editContent
  const [resizeTextArea, setResizeTextArea] = useState({
    rows: 1,
    minRows: 1,
    maxRows: 3,
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
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

    setEditContent(value);
  };

  useMemo(() => {
    if (editContent) {
      const editDefaultLength = editContent.split("\n").length;
      if (editDefaultLength > 3) {
        setResizeTextArea({
          ...resizeTextArea,
          rows: 3,
        });
      } else {
        setResizeTextArea({
          ...resizeTextArea,
          rows: editDefaultLength,
        });
      }
    }
  }, [editContent]);

  // Update comment
  const editToggle = async () => {
    setCommentIsEdit(!commentIsEdit);
  };

  const { isLoading: isLoadingEdit, mutate: updateComment } =
    useUpdateComment(id);

  const onEditComment = async () => {
    if (editContent.trim() !== "") {
      const editComment: any = {
        ...comment,
        content: editContent,
      };
      await updateComment({ commentId: id, editCommentObj: editComment });
      setEditContent("");
      setCommentIsEdit(false);
    }
  };

  // Delete comment
  const { isLoading: removeCommentLoading, mutate: deleteComment } =
    useDeleteComment(id);

  const onDeleteComment = async () => {
    await deleteComment(id);

    hideModal();
  };

  const resetToggle = async () => {
    setCommentIsEdit(false);
  };

  const getRecomments = async () => {
    const q = query(
      collection(dbService, "Recomments"),
      orderBy("createdAt", "asc"),
      where("commentId", "==", id as string)
    );

    onSnapshot(q, (snapshot) => {
      // q (쿼리)안에 담긴 collection 내의 변화가 생길 때 마다 매번 실행됨
      const newRecomments = snapshot.docs.map((doc: any) => {
        const newRecomment = {
          id: doc.id,
          ...doc.data(), // doc.data() : { text, createdAt, ...  }
        };
        return newRecomment;
      });
      setRecomments(newRecomments);
    });
  };

  const onClickReportComment = async () => {
    if (authService.currentUser?.uid) {
      const snapshot = await getDoc(
        doc(dbService, "ReportComments", id as string)
      );
      const snapshotdata = await snapshot.data();
      const pastComment = {
        ...snapshotdata,
      };

      if (pastComment.reporter) {
        if (
          pastComment.reporter
            .map((rep: any) => rep.userId === authService.currentUser?.uid)
            .includes(true)
        ) {
          showModal({
            modalType: "AlertModal",
            modalProps: { title: "이미 신고한 댓글입니다." },
          });
          return;
        } else {
          showModal({
            modalType: "ReportModal",
            modalProps: {
              type: "comment",
              post: comment,
              currentUser,
              pastPost: pastComment,
            },
          });
        }
      } else if (!pastComment.reporter) {
        showModal({
          modalType: "ReportModal",
          modalProps: {
            type: "comment",
            post: comment,
            currentUser,
            pastPost: pastComment,
          },
        });
      }
    } else {
      showModal({
        modalType: "ConfirmModal",
        modalProps: {
          title: "로그인 후 이용 가능합니다.",
          text: "로그인 페이지로 이동하시겠어요?",
          rightbtnfunc: () => {
            showModal({
              modalType: "LoginModal",
              modalProps: {},
            });
          },
        },
      });
    }
  };

  useEffect(() => {
    resetToggle();
    getRecomments();
    return;
  }, []);

  return (
    <>
      <li className="flex flex-col items-center justify-center py-6 border-b border-borderGray last:border-b-0 pr-6">
        <div className="flex space-x-3 sm:space-x-6 justify-between w-full">
          <Link
            href={`/users/${comment.userId}`}
            className="flex flex-col items-center space-y-2 w-[30%] md:w-[11%]"
          >
            {user?.imageURL && (
              <Image
                width={48}
                height={48}
                alt=""
                src={user?.imageURL as string}
                className="bg-slate-300 w-[32px] sm:w-[40px] aspect-square rounded-full object-cover"
              />
            )}
            <div className="flex justify-start items-center space-x-1">
              <span className="text-xs">{user?.nickname}</span>
              <span className="w-[8px] sm:w-[12px]">
                <Grade score={user?.point!} />
              </span>
            </div>
          </Link>
          <div className="space-y-6 flex flex-col justify-between w-full">
            {commentIsEdit ? (
              <textarea
                name="editContent"
                value={editContent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none text-xs sm:text-base"
                rows={resizeTextArea.rows}
                placeholder={content}
              />
            ) : (
              <pre className="whitespace-pre-wrap break-all text-xs sm:text-base">
                {content}
              </pre>
            )}
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 flex items-end">
                {createdAt}
              </span>
              {commentIsEdit && (
                <div className="flex justify-end items-end space-x-2">
                  <button
                    className="text-xs font-medium hover:text-black text-textGray"
                    onClick={editToggle}
                  >
                    취소
                  </button>
                  <button
                    className="text-xs font-medium hover:text-black text-textGray"
                    onClick={onEditComment}
                  >
                    완료
                  </button>
                </div>
              )}
              {authService.currentUser?.uid === userId ? (
                <div
                  className={`${
                    commentIsEdit ? "hidden" : "flex"
                  } flex justify-end items-end space-x-2 text-xs`}
                >
                  <button
                    onClick={editToggle}
                    className="hover:text-black text-textGray"
                  >
                    수정
                  </button>
                  <button
                    onClick={() =>
                      showModal({
                        modalType: "ConfirmModal",
                        modalProps: {
                          title: "댓글을 삭제 하시겠어요?",
                          text: "삭제한 댓글은 복원이 불가합니다.",
                          rightbtntext: "삭제",
                          rightbtnfunc: onDeleteComment,
                        },
                      })
                    }
                    className="hover:text-black text-textGray"
                  >
                    삭제
                  </button>
                  {recomments.length === 0 ? (
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className={`${
                        isOpen ? "text-black" : "text-textGray"
                      } hover:text-black`}
                    >
                      답글달기
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className={`${
                        isOpen ? "text-black" : "text-textGray"
                      } hover:text-black`}
                    >
                      답글 {recomments.length}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs">
                  <button onClick={onClickReportComment}>신고</button>
                  {recomments.length === 0 ? (
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className={`${isOpen ? "text-black" : "text-textGray"}`}
                    >
                      답글달기
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className={`${isOpen ? "text-black" : "text-textGray"}`}
                    >
                      답글 {recomments.length}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <Recomments
            id={id!}
            currentUser={currentUser}
            recomments={recomments}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            comment={comment}
            postId={postId}
          />
        )}
      </li>
    </>
  );
};

export default CommentList;
