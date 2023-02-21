import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { now } from "jquery";
import Link from "next/link";
import React from "react";

const AlarmCard = ({
  post,
  alarm,
  getAlarm,
}: {
  post: AlarmType;
  alarm: AlarmType[];
  getAlarm: () => Promise<void>;
}) => {
  let ResultTime = "";

  if (post?.createdAt) {
    let startTime = parseInt(post.createdAt);
    let nowTime = Date.now();
    let difference = nowTime - startTime;

    difference = Math.trunc(difference / 1000);

    // 초
    const seconds = 1;
    // 분
    const minute = seconds * 60;
    // 시
    const hour = minute * 60;
    // 일
    const day = hour * 24;
    // 달
    const mon = day * 30;
    // 년
    const year = mon * 12;

    if (difference < seconds) {
      ResultTime = "바로"; // 1초보다 작으면 바로 전
    } else if (difference < minute) {
      ResultTime = Math.trunc(difference / seconds) + "초 ";
      //분보다 작으면 몇초전인지
    } else if (difference < hour) {
      ResultTime = Math.trunc(difference / minute) + "분전 ";
      //시보다 작으면 몇분전인지
    } else if (difference < day) {
      ResultTime = Math.trunc(difference / hour) + "시 ";
      //일보다 작으면 몇시간전인지
    } else if (difference < mon) {
      ResultTime = Math.trunc(difference / day) + "일 ";
      //달보다 작으면 몇일 전인지
    } else if (difference < year) {
      ResultTime = Math.trunc(difference / mon) + "달 ";
      //년보다 작으면 몇달전인지
    } else {
      ResultTime = Math.trunc(difference / year) + "년 ";
    }
  }

  const onClickIsDone = async () => {
    const filterAlarm = alarm.filter((x) => x.createdAt !== post.createdAt);

    const newPost = {
      ...post,
      isDone: !post.isDone,
    };
    filterAlarm.push(newPost);

    await updateDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string),
      {
        alarm: filterAlarm,
      }
    );
    getAlarm();
  };
  const onClickDelete = async () => {
    const filterAlarm = alarm.filter((x) => x.createdAt !== post.createdAt);
    await updateDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string),
      {
        alarm: filterAlarm,
      }
    );
    getAlarm();
  };

  return (
    <div className="w-full px-3 py-2 border-b-[1px] border-[gray] flex flex-col">
      {post.isDone ? (
        <div className="text-sm text-gray-200">
          <span className="font-bold">댓글 : </span>
          <Link href={`/post/${post.postId}`}>
            <span>{post.content}</span>
          </Link>
        </div>
      ) : (
        <div onClick={onClickIsDone} className="font-bold text-sm">
          <span className="font-bold">댓글 : </span>
          <Link href={`/post/${post.postId}`}>
            <span>{post.content}</span>
          </Link>
        </div>
      )}

      <div className="text-[12px]">
        <span>by </span>
        <span>{post.nickname} </span>
        <span>{ResultTime}</span>
      </div>

      <div onClick={onClickDelete}> 삭제</div>
    </div>
  );
};

export default AlarmCard;
