import { dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUser = async (id: string) => {
  const userRef = doc(dbService, "Users", id as string);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const newUser = {
    ...userData,
  };

  return newUser;
};

// export const getCurrentUser = async (id: string) => {
//   if (id !== undefined && id !== null) {
//     const currentUserRef = doc(dbService, "Users", id as string);
//     const currentUserSnap = await getDoc(currentUserRef);
//     const currentUserData = currentUserSnap.data();

//     const newCurrentUser = {
//       ...currentUserData,
//     };
//     return newCurrentUser;
//   }
// };
