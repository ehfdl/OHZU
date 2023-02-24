import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import AlarmCard from "./alarm_card";

const AlarmModal = ({
  alarm,
  getAlarm,
  setIsAlarmOpenModal,
}: {
  alarm: AlarmType[];
  getAlarm: () => Promise<void>;
  setIsAlarmOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const alarmFalse = alarm.filter((content) => content.isDone === false);
  const alarmTrue = alarm.filter((content) => content.isDone === true);

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
    <div>
      <div
        onClick={() => setIsAlarmOpenModal(false)}
        className="w-full h-full fixed left-0 top-0 z-10"
      />
      <div className="w-[348px] h-[480px] py-3 px-3 mt-6 left-20 rounded bg-white border-primary border-[1px] z-20 flex flex-col justify-start items-center absolute">
        <div className="w-full py-3 px-3 text-[14px] flex justify-between">
          <div className="font-bold">전체 알림</div>
          <div className="flex gap-6 text-textGray">
            {alarmTrue.length === 0 ? (
              <div onClick={onClickAllReadDelete} className="cursor-pointer">
                읽은 알림 삭제
              </div>
            ) : (
              <div
                onClick={onClickAllReadDelete}
                className="text-primary cursor-pointer"
              >
                읽은 알림 삭제
              </div>
            )}

            {alarmFalse.length === 0 ? (
              <div onClick={onClickAllRead} className="cursor-pointer">
                모두 읽음
              </div>
            ) : (
              <div
                onClick={onClickAllRead}
                className=" text-primary cursor-pointer"
              >
                모두 읽음
              </div>
            )}
          </div>
        </div>
        <div className="border-[1px] border-[#f2f2f2] w-full"></div>

        <div className="w-full overflow-y-auto scrollbar-none">
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
    </div>
  );
};

export default AlarmModal;
