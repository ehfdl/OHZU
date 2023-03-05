import { dbService } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const addPost = async (newPost: any) => {
  await addDoc(collection(dbService, "Posts"), newPost);
};

export const getPost = async (id: string) => {
  const docRef = doc(dbService, "Posts", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const newPost = {
    ...data,
  };
  return newPost;
};

export const editPost = async ({
  postId,
  editPostObj,
}: {
  postId: string;
  editPostObj: any;
}) => {
  await updateDoc(doc(dbService, "Posts", postId), editPostObj);
};

export const removePost = async (postId: string) => {
  await deleteDoc(doc(dbService, "Posts", postId));

  const commentQuery = query(
    collection(dbService, "Comments"),
    where("postId", "==", postId)
  );

  const commentQuerySnapShot = await getDocs(commentQuery);

  const recommentQuery = query(
    collection(dbService, "Recomments"),
    where("postId", "==", postId)
  );

  const recommentQuerySnapShot = await getDocs(recommentQuery);

  if (commentQuerySnapShot !== null || commentQuerySnapShot !== undefined) {
    const newComment: any = [];
    commentQuerySnapShot.forEach((doc) => {
      const newCommentObj = {
        id: doc.id,
        ...doc.data(),
      };
      newComment.push(newCommentObj.id);
    });

    newComment.map(async (id: string) => {
      await deleteDoc(doc(dbService, "Comments", id as string));
    });
  }

  if (recommentQuerySnapShot !== null || recommentQuerySnapShot !== undefined) {
    const newRecomment: any = [];
    recommentQuerySnapShot.forEach((doc) => {
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
