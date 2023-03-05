import { dbService } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getUser = async (id: string) => {
  const userRef = doc(dbService, "Users", id as string);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const newUser = {
    ...userData,
  };

  return newUser;
};

export const editUser = async ({
  userId,
  editUserObj,
}: {
  userId: string;
  editUserObj: any;
}) => {
  await updateDoc(doc(dbService, "Users", userId), editUserObj);
};
