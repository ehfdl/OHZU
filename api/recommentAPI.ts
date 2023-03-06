import { dbService } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const addRecomment = async (newRecommentObj: any) => {
  await addDoc(collection(dbService, "Recomments"), newRecommentObj);
};

export const editRecomment = async ({
  recommentId,
  editRecommentObj,
}: {
  recommentId: string;
  editRecommentObj: any;
}) => {
  await updateDoc(doc(dbService, "Recomments", recommentId), editRecommentObj);
};

export const removeRecomment = async (recommentId: string) => {
  await deleteDoc(doc(dbService, "Recomments", recommentId));
};
