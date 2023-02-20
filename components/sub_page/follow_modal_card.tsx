import { authService, dbService } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";

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
        <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9] overflow-hidden">
          {profile.imageURL !== "" ? (
            <img
              src={profile.imageURL}
              className="w-[78px] aspect-square object-cover"
            />
          ) : null}
        </div>
      </Link>
      <div className="flex flex-col ml-5 my-[2px]">
        <Link href={`/users/${profile.userId}`}>
          <div className="font-bold">{profile.nickname}</div>
        </Link>
        <div className="text-sm text-[#8e8e93] max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
          {profile.introduce}
        </div>
      </div>

      {profile.userId ===
      authService.currentUser?.uid ? null : profile?.follower!.includes(
          authService.currentUser?.uid as string
        ) ? (
        <button
          onClick={onClickFollowUpdate}
          className="ml-[14px] w-[98px] h-[30px] rounded-[50px] bg-[#FFF0f0] text-sm text-[#ff6161] flex justify-center items-center"
        >
          팔로우
        </button>
      ) : (
        <button
          onClick={onClickFollowUpdate}
          className="ml-[14px] w-[98px] h-[30px] rounded-[50px] bg-[#FF6161] text-sm text-white  flex justify-center items-center"
        >
          팔로우
        </button>
      )}
    </div>
  );
};

export default FollowModalCard;
