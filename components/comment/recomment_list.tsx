import { authService, dbService } from "@/firebase";
import useModal from "@/hooks/useModal";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Grade from "../grade";
import useDeleteRecomment from "@/hooks/query/recomment/useDeleteRecomment";
import useUpdateRecomment from "@/hooks/query/recomment/useUpdateRecomment";
import { useGetUser } from "@/hooks/query/user/useGetUser";

interface RecommentListPropsType {
  recomment: CommentType;
}

const RecommentList = ({ recomment }: RecommentListPropsType) => {
  const { commentId, userId, createdAt, content, id } = recomment;

  const [editRecommentContent, setEditRecommentContent] = useState<string>();
  const [recommentIsEdit, setRecommentIsEdit] = useState(false);

  const { showModal, hideModal } = useModal();

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

    setEditRecommentContent(value);
  };

  useMemo(() => {
    if (editRecommentContent) {
      const editDefaultLength = editRecommentContent.split("\n").length;
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
  }, [editRecommentContent]);

  // Get Recomment User
  const { data: recommentUser, isLoading: recommentUserLoading } =
    useGetUser(userId);

  // Update recomment
  const editToggle = async () => {
    setRecommentIsEdit(!recommentIsEdit);
  };

  const { isLoading: isLoadingEdit, mutate: updateRecomment } =
    useUpdateRecomment(id);

  const onEditRecomment = async () => {
    if (editRecommentContent?.trim() !== "") {
      const editComment: any = {
        ...recomment,
        content: editRecommentContent,
      };
      await updateRecomment({ recommentId: id, editRecommentObj: editComment });
      setEditRecommentContent("");
      setRecommentIsEdit(false);
    }
  };

  // Delete Recomment
  const { isLoading: removeRecommentLoading, mutate: deleteRecomment } =
    useDeleteRecomment(id);

  const onDeleteRecomment = async () => {
    await deleteRecomment(id);
    hideModal();
  };

  const onClickReportComment = async () => {
    if (authService.currentUser?.uid) {
      const snapshot = await getDoc(
        doc(dbService, "ReportReComments", id as string)
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
            modalProps: { title: "이미 신고한 답글입니다." },
          });
          return;
        } else {
          showModal({
            modalType: "ReportModal",
            modalProps: {
              type: "recomment",
              post: recomment,
              currentUser: recommentUser,
              pastPost: pastComment,
            },
          });
        }
      } else if (!pastComment.reporter) {
        showModal({
          modalType: "ReportModal",
          modalProps: {
            type: "recomment",
            post: recomment,
            currentUser: recommentUser,
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
    setEditRecommentContent(content);
  }, []);
  return (
    <>
      <li className="py-6 flex space-x-3 sm:space-x-6 justify-start w-full border-b border-borderGray relative before:contents-[''] before:w-4 before:h-4 before:border-l-2 before:border-b-2 before:absolute before:border-iconDefault before:left-0 sm:before:left-4 before:top-8 pl-4 sm:pl-8 before:opacity-0 first:before:opacity-100">
        <Link
          aria-label="recomment-user"
          href={{
            pathname: `${
              authService.currentUser?.uid === recommentUser?.userId
                ? `/mypage`
                : `/users/${recommentUser?.nickname}`
            }`,
            query: {
              userId: recomment?.userId,
            },
          }}
          as={`${
            authService.currentUser?.uid === recommentUser?.userId
              ? `/mypage`
              : `/users/${recommentUser?.nickname}`
          }`}
          className="flex flex-col items-center space-y-2 w-[34%] md:w-[13%] "
        >
          {recommentUser?.imageURL && (
            <Image
              width={48}
              height={48}
              alt=""
              src={recommentUser?.imageURL as string}
              className="bg-slate-300 w-[32px] sm:w-[40px] aspect-square rounded-full object-cover"
            />
          )}
          <div className="flex justify-start items-center space-x-1">
            <span className="text-xs">{recommentUser?.nickname}</span>
            <span className="w-[8px] sm:w-[12px]">
              <Grade score={recommentUser?.point!} />
            </span>
          </div>
        </Link>
        <div className="space-y-6 flex flex-col justify-between w-full">
          {recommentIsEdit ? (
            <textarea
              name="editContent"
              value={editRecommentContent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none text-xs sm:text-base"
              rows={resizeTextArea.rows}
              placeholder={content}
            />
          ) : (
            <pre className="whitespace-pre-wrap break-all text-xs sm:text-sm">
              {content}
            </pre>
          )}
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 flex items-end">
              {createdAt}
            </span>
            {recommentIsEdit && (
              <div className="flex justify-end items-end space-x-2 text-gray-500">
                <button
                  aria-label="cancel"
                  className="text-xs font-medium"
                  onClick={editToggle}
                >
                  취소
                </button>
                <button
                  aria-label="done"
                  className="text-xs font-medium"
                  onClick={onEditRecomment}
                >
                  완료
                </button>
              </div>
            )}
            {authService.currentUser?.uid === userId ? (
              <div
                className={`${
                  recommentIsEdit ? "hidden" : "flex"
                } flex justify-end items-end space-x-2 sm:space-x-4 text-gray-500 text-xs`}
              >
                <button aria-label="edit" onClick={editToggle}>
                  수정
                </button>
                <button
                  aria-label="delete"
                  onClick={() =>
                    showModal({
                      modalType: "ConfirmModal",
                      modalProps: {
                        title: "답글을 삭제 하시겠어요?",
                        text: "삭제한 답글은 복원이 불가합니다.",
                        rightbtntext: "삭제",
                        rightbtnfunc: onDeleteRecomment,
                      },
                    })
                  }
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/6">
                <button aria-label="report" onClick={onClickReportComment}>
                  신고
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    </>
  );
};
export default RecommentList;
