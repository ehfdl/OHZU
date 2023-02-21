import { authService, dbService } from "@/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import RecommentList from "./recomment_list";

interface RecommentPropsType {
  id: string;
  dateForm: string;
  currentUser: UserType;
  recomments: CommentType[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Recomments = ({
  id,
  dateForm,
  recomments,
  setIsOpen,
  isOpen,
}: RecommentPropsType) => {
  const initialRecomment = {
    content: "",
    commentId: "",
    userId: "",
    createdAt: "",
    isEdit: false,
  };

  const [recomment, setRecomment] = useState<CommentType>(initialRecomment);
  const [resizeTextArea, setResizeTextArea] = useState({
    rows: 1,
    minRows: 1,
    maxRows: 10,
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
    setRecomment({
      ...recomment,
      [name]: value,
    });
  };

  const addRecomment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newRecomment = {
      content: recomment.content,
      commentId: id,
      userId: authService.currentUser?.uid,
      createdAt: dateForm,
      isEdit: false,
    };
    if (recomment.content.trim() !== "") {
      await setDoc(doc(dbService, "Recomments", id), newRecomment);
    } else {
      alert("내용이 없습니다!");
    }
    setRecomment(initialRecomment);
    setResizeTextArea({
      ...resizeTextArea,
      rows: 1,
    });
  };

  return (
    <div className="w-11/12 ml-auto">
      <ul className="divide-y-[1px] divide-gray-300 w-full">
        {recomments.map((item) => (
          <RecommentList key={item.id} recomment={item} />
        ))}
      </ul>
      <form className="w-full flex items-center relative space-x-6 mt-6">
        <textarea
          disabled={authService.currentUser ? false : true}
          name="content"
          value={recomment.content}
          onChange={handleChange}
          id=""
          className="w-full p-2 border h-auto scrollbar-none"
          placeholder="댓글을 입력해주세요."
          rows={resizeTextArea.rows}
        />
        <button
          disabled={authService.currentUser ? false : true}
          onClick={addRecomment}
          className="absolute right-0 bottom-2.5 pr-4 disabled:text-gray-400"
        >
          <span className="text-sm font-medium">등록</span>
        </button>
      </form>
      <button
        onClick={() => {
          setIsOpen(false);
        }}
        className="block mx-auto my-6 p-2"
      >
        답글 접기
      </button>
    </div>
  );
};

export default Recomments;
