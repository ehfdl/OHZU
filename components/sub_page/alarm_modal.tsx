import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import AlarmCard from "./alarm_card";
import { FiX } from "react-icons/fi";

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

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  return (
    <div>
      <div
        onClick={() => setIsAlarmOpenModal(false)}
        className="hidden sm:block w-full h-full fixed left-0 top-0 z-10"
      />
      <div className="sm:w-[348px] sm:h-[480px] w-full h-full fixed top-0 sm:top-14 left-0 py-3 px-3 mt-0 sm:mt-4 sm:left-52 rounded bg-white sm:border-primary sm:border-[1px] z-20 flex flex-col justify-start items-center sm:absolute">
        <button
          className=" sm:hidden  w-9 aspect-square absolute top-4 right-4"
          onClick={() => setIsAlarmOpenModal(false)}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>
        <div className="w-full py-3 px-3 text-[14px] flex justify-between mt-12 sm:mt-0">
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
