import { authService, dbService } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillBell, AiOutlineBell } from "react-icons/ai";
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
      <div className="hidden sm:block sm:mr-2">
        <Image
          src="/image/w_bell.svg"
          width={32}
          height={32}
          alt="w_bell"
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
      <div className="sm:hidden ml-1">
        <Image
          src="/image/m_bell.svg"
          width={28}
          height={28}
          alt="w_bell"
          onClick={() => setIsAlarmOpenModal(!isAlarmOpenModal)}
          className="w-7 h-7 cursor-pointer"
        />
        {alarm.filter((content) => content.isDone === false).length !== 0 ? (
          <div className="w-[6px] h-[6px] rounded-full bg-primary text-[8px] text-white flex justify-center items-center pt-[1px] absolute top-0 ml-[22px] "></div>
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
