import { authService, dbService } from "@/firebase";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
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
        if (pastComment.reporter.includes(authService.currentUser?.uid)) {
          alert("이미 신고한 답글입니다.");
          return;
        } else {
          pastComment.reporter.push(authService.currentUser?.uid);
          await updateDoc(doc(dbService, "ReportReComments", id as string), {
            reporter: pastComment.reporter,
          });
          alert("새로운 신고자!");
        }
      } else if (!pastComment.reporter) {
        const newComments = {
          commentId: id,
          content: content,
          reporter: [authService.currentUser?.uid],
        };
        await setDoc(
          doc(dbService, "ReportReComments", id as string),
          newComments
        );
        alert("신고 완료");
      }
    } else {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  useEffect(() => {
    getRecommentUser();
    setEditRecommentContent(content);
  }, []);
  return (
    <>
      <li className="py-6 flex space-x-3 sm:space-x-6 justify-end w-full border-b border-borderGray relative before:contents-[''] before:w-4 before:h-4 before:border-l-2 before:border-b-2 before:absolute before:border-iconDefault before:left-0 sm:before:left-4 before:top-8 pl-4 sm:pl-8 before:opacity-0 first:before:opacity-100">
        <Link
          href={`/users/${recomment.userId}`}
          className="flex flex-col items-center space-y-2 w-[34%] md:w-[13%] "
        >
          <Image
            width={48}
            height={48}
            alt=""
            src={recommentUser?.imageURL as string}
            className="bg-slate-300 w-[32px] sm:w-[40px] aspect-square rounded-full object-cover"
          />
          <div className="flex justify-start items-center space-x-1">
            <span className="text-xs">{recommentUser?.nickname}</span>
            <span className="w-[8px] sm:w-[12px]">
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
            {isEdit && (
              <div className="flex justify-end items-end space-x-2 text-gray-500">
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
                } flex justify-end items-end space-x-2 sm:space-x-4 text-gray-500 text-xs`}
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
