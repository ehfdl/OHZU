import { authService, dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { use, useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import AlarmModal from "./alarm_modal";

const Alarm = () => {
  const [alarm, setAlarm] = useState<AlarmType[]>([{}]);

  const [isAlarmOpenModal, setIsAlarmOpenModal] = useState(false);

  const getAlarm = async () => {
    const snapshot = await getDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string)
    );
    const snapshotdata = await snapshot.data();
    const newPost = {
      ...snapshotdata,
    };
    const filterPost = newPost.alarm.sort((a: AlarmType, b: AlarmType) => {
      if (a.createdAt! < b.createdAt!) return 1;
      if (a.createdAt! > b.createdAt!) return -1;
      return 0;
    });

    setAlarm(newPost?.alarm);
  };

  useEffect(() => {
    getAlarm();
  }, [authService.currentUser?.uid]);

  return (
    <div className="mr-2">
      {alarm.filter((content) => content.isDone === false) ? (
        <AiFillBell
          onClick={() => setIsAlarmOpenModal(!isAlarmOpenModal)}
          className="w-5 h-5 cursor-pointer"
        />
      ) : (
        <div>없슈</div>
      )}

      {isAlarmOpenModal ? (
        <AlarmModal alarm={alarm} getAlarm={getAlarm} />
      ) : null}
    </div>
  );
};

export default Alarm;
