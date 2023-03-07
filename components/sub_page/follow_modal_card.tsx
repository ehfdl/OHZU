import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Grade from "../grade";

const FollowModalCard = ({
  profile,
  getMyProfile,
  myProfile,
}: {
  profile: UserType;
  myProfile: any;
  getMyProfile: () => Promise<void>;
}) => {
  const onClickFollowUpdate = async () => {
    const FollowerArray = profile?.follower!.includes(
      authService.currentUser?.uid as string
    );

    if (FollowerArray) {
      const newFollowerArray = profile?.follower!.filter(
        (id: any) => id !== authService.currentUser?.uid
      );
      const newFollowingArray = myProfile.following.filter(
        (id: any) => id !== profile.userId
      );
      await updateDoc(doc(dbService, "Users", profile.userId as string), {
        follower: newFollowerArray,
      });
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        {
          following: newFollowingArray,
        }
      );
    } else if (!FollowerArray) {
      const newFollowerArray = profile?.follower!.push(
        authService.currentUser?.uid as string
      );
      const newFollowingArray = myProfile.following.push(profile.userId);
      await updateDoc(doc(dbService, "Users", profile.userId as string), {
        follower: profile.follower,
      });
      await updateDoc(
        doc(dbService, "Users", authService.currentUser?.uid as string),
        {
          following: myProfile.following,
        }
      );
    }
    getMyProfile();
  };

  return (
    <div key={profile?.userId} className="w-full flex justify-start">
      <Link href={`/users/${profile.userId}`}>
        <div className="w-14 sm:w-[78px] aspect-square rounded-full bg-[#d9d9d9] overflow-hidden">
          {profile.imageURL !== "" ? (
            <Image
              src={profile.imageURL!}
              className="w-14 sm:w-[78px] aspect-square object-cover"
              width={56}
              height={56}
              alt=""
            />
          ) : null}
        </div>
      </Link>
      <div className="flex flex-col ml-5 sm:my-[2px]">
        <div className="flex w-[270px] sm:w-[390px] justify-between">
          <div className="flex gap-1">
            <Link href={`/users/${profile.userId}`}>
              <span className="font-bold text-[12px] sm:text-base">
                {profile.nickname}
              </span>
            </Link>
            <span className="w-[10px] h-3 sm:w-[13px] sm:h-4 mt-2 sm:mt-[5px]">
              <Grade score={profile.point!} />
            </span>
          </div>

          <div>
            {profile.userId ===
            authService.currentUser?.uid ? null : profile?.follower!.includes(
                authService.currentUser?.uid as string
              ) ? (
              <button
                onClick={onClickFollowUpdate}
                className="w-[60px] h-5 text-[11px] sm:text-sm sm:w-[98px] sm:h-[30px] rounded-[100px] sm:rounded-[50px] bg-second  text-primary flex justify-center items-center mr-1"
              >
                팔로우
              </button>
            ) : (
              <button
                onClick={onClickFollowUpdate}
                className="w-[60px] h-5 text-[11px] sm:text-sm sm:w-[98px] sm:h-[30px] rounded-[100px] sm:rounded-[50px] bg-primary  text-white  flex justify-center items-center mr-1"
              >
                팔로우
              </button>
            )}
          </div>
        </div>
        <div className="text-[11px] sm:text-sm text-textGray max-h-9 sm:max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
          {profile.introduce}
        </div>
      </div>
    </div>
  );
};

export default FollowModalCard;
