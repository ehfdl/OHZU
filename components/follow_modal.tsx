import Link from "next/link";
import React from "react";
import { FiX } from "react-icons/fi";

const FollowModal = ({
  setIsOpenFollowModal,
  setFollow,
  follow,
  usersFollowerProfile,
  usersFollowingProfile,
}: {
  setIsOpenFollowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFollow: React.Dispatch<React.SetStateAction<string>>;
  follow: string;
  usersFollowerProfile: UserType[];
  usersFollowingProfile: UserType[];
}) => {
  console.log(usersFollowerProfile);
  return (
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)]" />
      <div className="w-[588px] h-[820px] bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="w-10 aspect-square absolute mt-8 ml-[500px]"
          onClick={() => setIsOpenFollowModal(false)}
        >
          <FiX className="w-full h-full text-[#acacac]" />
        </button>
        <div className="w-full flex justify-around mt-10 text-[24px]">
          <label
            onChange={() => setFollow("follower")}
            className="w-1/2 text-slate-500 text-center"
          >
            <input
              type="radio"
              name="follow"
              value="follower"
              defaultChecked={follow === "follower"}
              className="hidden peer"
            />
            <span className="w-full block cursor-pointer py-5 border-b-[1px] border-[#fff0f0] peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-[#ff6161] peer-checked:border-[#ff6161]">
              팔로워
            </span>
          </label>
          <label
            onChange={() => setFollow("following")}
            className="w-1/2 text-slate-500 text-center"
          >
            <input
              type="radio"
              name="follow"
              value="following"
              className="hidden peer"
              defaultChecked={follow === "following"}
            />
            <span className="w-full block cursor-pointer py-5 border-b-[1px] border-[#fff0f0] peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-[#ff6161] peer-checked:border-[#ff6161]">
              팔로잉
            </span>
          </label>
        </div>

        <div className="flex pt-10 flex-col gap-6 justify-start items-center w-[492px] overflow-auto scrollbar-none">
          {follow === "following" && usersFollowingProfile
            ? usersFollowingProfile.map((profile) => (
                <div
                  key={profile?.userId}
                  className="w-full flex justify-start"
                >
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
                  <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
                    팔로잉
                  </button>
                </div>
              ))
            : follow === "follower" && usersFollowerProfile
            ? usersFollowerProfile.map((profile) => (
                <div
                  key={profile?.userId}
                  className="w-full flex justify-start"
                >
                  <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9] overflow-hidden">
                    <img
                      src={profile.imageURL}
                      className="w-[78px] aspect-square object-cover"
                    />
                  </div>
                  <div className="flex flex-col ml-5 my-[2px]">
                    <div className="font-bold">{profile.nickname}</div>
                    <div className="text-sm text-[#8e8e93] max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                      {profile.introduce}
                    </div>
                  </div>
                  <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
                    팔로잉
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
