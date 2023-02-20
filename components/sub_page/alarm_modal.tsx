import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import AlarmCard from "./alarm_card";

const AlarmModal = ({
  alarm,
  getAlarm,
}: {
  alarm: AlarmType[];
  getAlarm: () => Promise<void>;
}) => {
  const onClickAllReadDelete = async () => {
    const filterAlarm = alarm.filter((content) => content.isDone === false);

    await updateDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string),
      {
        alarm: filterAlarm,
      }
    );
    getAlarm();
  };
  const onClickAllRead = async () => {
    const filterAlarm = alarm.map((content) => {
      content.isDone = true;
      return content;
    });

    await updateDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string),
      {
        alarm: filterAlarm,
      }
    );
    getAlarm();
  };

  return (
    <div className="w-[250px] h-[260px] mt-12 left-12 rounded bg-white border-[#ff6161] border-[1px] z-10 flex flex-col justify-start items-center absolute">
      <div onClick={onClickAllReadDelete} className="bg-slate-400">
        일괄삭제
      </div>
      <div onClick={onClickAllRead} className="bg-slate-400">
        {" "}
        모두 읽음
      </div>
      <div className=" overflow-scroll w-full">
        {alarm?.map((post) => (
          <AlarmCard
            key={post.createdAt}
            post={post}
            alarm={alarm}
            getAlarm={getAlarm}
          />
        ))}
      </div>
    </div>
  );
};

export default AlarmModal;
