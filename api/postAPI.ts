import { dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getPost = async (id: string) => {
  const docRef = doc(dbService, "Posts", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const newPost = {
    ...data,
  };
  return newPost;
};
