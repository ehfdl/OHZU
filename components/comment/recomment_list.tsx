import { authService, dbService } from "@/firebase";
import useModal from "@/hooks/useModal";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DeleteModal from "../delete_modal";
import Grade from "../grade";

interface RecommentListPropsType {
  recomment: CommentType;
}

const RecommentList = ({ recomment }: RecommentListPropsType) => {
  const { commentId, userId, createdAt, isEdit, content, id } = recomment;
  const [recommentUser, setRecommentUser] = useState<UserType>();
  const [editRecommentContent, setEditRecommentContent] = useState<string>();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { showModal } = useModal();

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

  const deleteToggle = () => {
    setDeleteConfirm(!deleteConfirm);
  };

  const editToggle = async () => {
    await updateDoc(doc(dbService, "Recomments", id as string), {
      isEdit: !isEdit,
    });
  };

  const editRecomment = async (id: string, edit: any) => {
    await updateDoc(doc(dbService, "Recomments", id), {
      ...recomment,
      content: edit,
      isEdit: false,
    });
    setEditRecommentContent("");
  };

  const deleteRecomment = async (id: string) => {
    await deleteDoc(doc(dbService, "Recomments", id));
  };

  const getRecommentUser = async () => {
    if (userId) {
      const userRef = doc(dbService, "Users", userId! as string);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const newUser = {
        ...userData,
      };

      setRecommentUser(newUser);
    }
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
          alert("이미 신고한 댓글입니다.");
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
    getRecommentUser();
    setEditRecommentContent(content);
  }, []);
  return (
    <>
      <li className="py-6 flex space-x-6 justify-end w-full border-b border-borderGray relative before:contents-[''] before:w-4 before:h-4 before:border-l-2 before:border-b-2 before:absolute before:border-iconDefault before:left-4 before:top-8 pl-8 before:opacity-0 first:before:opacity-100">
        <Link
          href={`/users/${recomment.userId}`}
          className="flex flex-col items-center space-y-2 w-[13%] "
        >
          <img
            src={recommentUser?.imageURL}
            className="bg-slate-300 w-[40px] aspect-square rounded-full object-cover"
          />
          <div className="flex justify-start space-x-1">
            <span className="text-xs">{recommentUser?.nickname}</span>
            <span className="w-[12px]">
              <Grade score={recommentUser?.point!} />
            </span>
          </div>
        </Link>
        <div className="space-y-6 flex flex-col justify-between w-full">
          {isEdit ? (
            <textarea
              name="editContent"
              value={editRecommentContent}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-phGray h-auto scrollbar-none resize-none focus-visible:outline-none"
              rows={resizeTextArea.rows}
              placeholder={content}
            />
          ) : (
            <pre className="whitespace-pre-wrap break-all">{content}</pre>
          )}
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 flex items-end">
              {createdAt}
            </span>
            {isEdit && (
              <div className="flex justify-end items-end space-x-2">
                <button className="text-xs font-medium" onClick={editToggle}>
                  취소
                </button>
                <button
                  className="text-xs font-medium"
                  onClick={() =>
                    editRecomment(id as string, editRecommentContent)
                  }
                >
                  완료
                </button>
              </div>
            )}
            {authService.currentUser?.uid === userId ? (
              <div
                className={`${
                  isEdit ? "hidden" : "flex"
                } flex justify-end items-end space-x-4 text-gray-500 text-xs`}
              >
                <button onClick={editToggle}>수정</button>
                {/* <button onClick={() => deleteComment(id as string)}>삭제</button> */}
                <button onClick={deleteToggle}>삭제</button>
              </div>
            ) : (
              <div className="flex justify-end items-end space-x-2 text-gray-500 text-xs w-1/6">
                <button onClick={onClickReportComment}>신고</button>
              </div>
            )}
          </div>
        </div>

        {deleteConfirm && (
          <DeleteModal
            deleteRecomment={deleteRecomment}
            setDeleteConfirm={setDeleteConfirm}
            id={id}
            text="답글"
            content="삭제한 답글은 복원이 불가합니다."
          />
        )}
      </li>
    </>
  );
};
export default RecommentList;
