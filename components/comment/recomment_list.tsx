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

  const createdAtS = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(createdAt);

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
            modalProps: { title: "?????? ????????? ???????????????." },
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
          title: "????????? ??? ?????? ???????????????.",
          text: "????????? ???????????? ??????????????????????",
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
      <li className="py-6 flex space-x-3 sm:space-x-6 justify-start w-full border-b border-borderGray relative before:contents-[''] before:w-4 before:h-4 before:border-l-2 before:border-b-2 before:absolute before:border-iconDefault before:left-0 sm:before:left-4 before:top-8 pl-8 sm:pl-10 before:opacity-0 first:before:opacity-100">
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
          className="flex flex-col items-center space-y-2 w-[32px] sm:w-[40px] aspect-square"
        >
          {recommentUser?.imageURL && (
            <Image
              width={48}
              height={48}
              alt=""
              src={recommentUser?.imageURL as string}
              className="w-8 sm:w-10 aspect-square rounded-full object-cover"
            />
          )}
        </Link>
        <div className="flex flex-col justify-between w-[calc(100%-2.5rem)] sm:w-[calc(100%-3rem)]">
          <div className="flex justify-start items-center mb-0.5">
            <span className="text-xs mr-1">{recommentUser?.nickname}</span>
            <span className="w-[8px] sm:w-[12px] mr-2">
              <Grade score={recommentUser?.point!} />
            </span>
            <span className="text-xs text-gray-500 flex items-end">
              {createdAtS}
            </span>
          </div>
          {recommentIsEdit ? (
            <textarea
              name="editContent"
              value={editRecommentContent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none text-sm sm:text-base"
              rows={resizeTextArea.rows}
              placeholder={content}
            />
          ) : (
            <pre className="whitespace-pre-wrap break-all text-sm sm:text-base">
              {content}
            </pre>
          )}
          <div className="flex justify-end mt-2">
            {recommentIsEdit && (
              <div className="flex justify-end items-end space-x-6">
                <button
                  aria-label="cancel"
                  className="text-xs font-medium"
                  onClick={editToggle}
                >
                  ??????
                </button>
                <button
                  aria-label="done"
                  className="text-xs font-medium"
                  onClick={onEditRecomment}
                >
                  ??????
                </button>
              </div>
            )}
            {authService.currentUser?.uid === userId ? (
              <div
                className={`${
                  recommentIsEdit ? "hidden" : "flex"
                } flex justify-end items-end space-x-6 text-xs text-textGray`}
              >
                <button aria-label="edit" onClick={editToggle}>
                  ??????
                </button>
                <button
                  aria-label="delete"
                  onClick={() =>
                    showModal({
                      modalType: "ConfirmModal",
                      modalProps: {
                        title: "????????? ?????? ????????????????",
                        text: "????????? ????????? ????????? ???????????????.",
                        rightbtntext: "??????",
                        rightbtnfunc: onDeleteRecomment,
                      },
                    })
                  }
                >
                  ??????
                </button>
              </div>
            ) : (
              <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/6">
                <button aria-label="report" onClick={onClickReportComment}>
                  ??????
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
