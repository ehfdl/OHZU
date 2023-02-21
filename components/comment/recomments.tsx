import { authService, dbService } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
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
  currentUser,
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
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
      userId: currentUser.userId,
      createdAt: dateForm,
      isEdit: false,
    };
    if (recomment.content.trim() !== "") {
      await addDoc(collection(dbService, "Recomments"), newRecomment);
    } else {
      alert("내용이 없습니다!");
    }
    setRecomment(initialRecomment);
  };

  return (
    <div className="w-11/12 ml-auto">
      <ul className="divide-y-[1px] divide-gray-300 w-full">
        {recomments.map((item) => (
          <RecommentList recomment={item} />
        ))}
      </ul>
      <form className="w-full flex items-center relative space-x-6 mt-6">
        <textarea
          disabled={authService.currentUser ? false : true}
          name="content"
          value={recomment.content}
          onChange={handleChange}
          id=""
          className="w-full p-2 border h-10 resize-none scrollbar-none"
          placeholder="댓글을 입력해주세요."
        />
        <button
          disabled={authService.currentUser ? false : true}
          onClick={addRecomment}
          className="absolute right-0 pr-4 disabled:text-gray-400"
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
