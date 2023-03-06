import { dbService } from "@/firebase";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const setReport = async ({
  reportId,
  reportType,
  reportObj,
}: {
  reportId: string;
  reportType: string;
  reportObj: any;
}) => {
  await setDoc(doc(dbService, reportType, reportId), reportObj);
};

export const getReport = async ({
  reportId,
  reportType,
}: {
  reportId: string;
  reportType: string;
}) => {
  const snapshot = await getDoc(doc(dbService, reportType, reportId));
  const snapshotdata = await snapshot.data();
  const pastPost = {
    ...snapshotdata,
  };
  return pastPost;
};

export const editReport = async ({
  reportId,
  reportType,
  reportObj,
}: {
  reportId: string;
  reportType: string;
  reportObj: any;
}) => {
  await updateDoc(doc(dbService, reportType, reportId), reportObj);
};

export const removeReport = async ({
  reportId,
  reportType,
}: {
  reportId: string;
  reportType: string;
}) => {
  deleteDoc(doc(dbService, reportType, reportId));
};
