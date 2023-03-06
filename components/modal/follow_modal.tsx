import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import FollowModalCard from "../sub_page/follow_modal_card";

const FollowModal = ({
  setIsOpenFollowModal,
  setFollow,
  follow,
  usersFollowerProfile,
  usersFollowingProfile,
  myProfile,
  getMyProfile,
}: {
  setIsOpenFollowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFollow: React.Dispatch<React.SetStateAction<string>>;
  follow: string;
  usersFollowerProfile: UserType[];
  usersFollowingProfile: UserType[];
  myProfile: any;
  getMyProfile: () => Promise<void>;
}) => {
  console.log(follow);
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
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]" />
      <div className="w-[390px] h-full sm:w-[588px] sm:h-[820px] rounded bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="sm:w-10 w-9 aspect-square absolute mt-6 sm:mt-8 ml-[340px] sm:ml-[500px]"
          onClick={() => setIsOpenFollowModal(false)}
        >
          <FiX className="w-full h-full text-phGray" />
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
            <span className="w-full block cursor-pointer py-5 border-b-[1px] border-second peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
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
            <span className="w-full block cursor-pointer py-5 border-b-[1px] border-second peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
              팔로잉
            </span>
          </label>
        </div>

        <div className="flex pt-8 sm:pt-10 flex-col gap-6 justify-start items-center w-[342px] sm:w-[492px] overflow-auto scrollbar-none">
          {follow === "following" && usersFollowingProfile
            ? usersFollowingProfile.map((profile) => (
                <FollowModalCard
                  key={profile.userId}
                  profile={profile}
                  myProfile={myProfile}
                  getMyProfile={getMyProfile}
                />
              ))
            : follow === "follower" && usersFollowerProfile
            ? usersFollowerProfile.map((profile) => (
                <FollowModalCard
                  key={profile.userId}
                  profile={profile}
                  myProfile={myProfile}
                  getMyProfile={getMyProfile}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
