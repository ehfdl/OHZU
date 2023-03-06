import { dbService } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const addComment = async (newComment: any) => {
  await addDoc(collection(dbService, "Comments"), newComment);
};

export const editComment = async ({
  commentId,
  editCommentObj,
}: {
  commentId: string;
  editCommentObj: any;
}) => {
  await updateDoc(doc(dbService, "Comments", commentId), editCommentObj);
};

export const removeComment = async (commentId: string) => {
  await deleteDoc(doc(dbService, "Comments", commentId));

  const q = query(
    collection(dbService, "Recomments"),
    where("commentId", "==", commentId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot !== null || querySnapshot !== undefined) {
    const newRecomment: any = [];
    querySnapshot.forEach((doc) => {
      const newObj = {
        id: doc.id,
        ...doc.data(),
      };
      newRecomment.push(newObj.id);
    });

    newRecomment.map(async (id: string) => {
      await deleteDoc(doc(dbService, "Recomments", id as string));
    });
  }
};
