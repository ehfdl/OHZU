import { authService, dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import AlarmModal from "./alarm_modal";

const Alarm = ({ ssuid }: { ssuid: string }) => {
  const [alarm, setAlarm] = useState<AlarmType[]>([{}]);

  const [isAlarmOpenModal, setIsAlarmOpenModal] = useState(false);

  const getAlarm = async () => {
    const snapshot = await getDoc(
      doc(dbService, "Users", (authService.currentUser?.uid as string) || ssuid)
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
    <>
      {/* 웹 */}
      <div className="hidden sm:block mr-2">
        <AiFillBell
          onClick={() => setIsAlarmOpenModal(!isAlarmOpenModal)}
          className="sm:w-8 sm:h-8 w-6 h-6 cursor-pointer"
        />
        {alarm.filter((content) => content.isDone === false).length !== 0 ? (
          <div className="w-4 h-4 rounded-full bg-primary text-[8px] text-white flex justify-center items-center pt-[1px] absolute top-6 ml-5 ">
            {alarm.filter((content) => content.isDone === false).length}
          </div>
        ) : (
          <div></div>
        )}

        {isAlarmOpenModal ? (
          <AlarmModal
            alarm={alarm}
            getAlarm={getAlarm}
            setIsAlarmOpenModal={setIsAlarmOpenModal}
          />
        ) : null}
      </div>

      {/* 모바일 */}
      <div className="sm:hidden mr-2">
        <AiFillBell
          onClick={() => setIsAlarmOpenModal(!isAlarmOpenModal)}
          className="w-7 h-7 cursor-pointer"
        />
        {alarm.filter((content) => content.isDone === false).length !== 0 ? (
          <div className="w-[6px] h-[6px] rounded-full bg-primary text-[8px] text-white flex justify-center items-center pt-[1px] absolute top-0 ml-6 "></div>
        ) : (
          <div></div>
        )}

        {isAlarmOpenModal ? (
          <AlarmModal
            alarm={alarm}
            getAlarm={getAlarm}
            setIsAlarmOpenModal={setIsAlarmOpenModal}
          />
        ) : null}
      </div>
    </>
  );
};

export default Alarm;
