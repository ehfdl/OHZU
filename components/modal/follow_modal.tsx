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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px] flex justify-center items-center sm:py-10 !m-0 z-10 flex-wrap overflow-scroll scrollbar-none">
      <div className="w-full relative max-w-[390px] sm:max-w-[588px] pb-10 pt-2 bg-white z-40 flex flex-col justify-start items-center rounded">
        <button
          aria-label="close"
          className="sm:w-10 w-9 aspect-square absolute right-4 top-4 sm:right-8 sm:top-8"
          onClick={() => setIsOpenFollowModal(false)}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>
        <div className="w-full flex justify-around text-[24px] mt-8 sm:mt-16">
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

        <div className="flex pt-8 sm:pt-10 flex-col gap-6 justify-start items-center w-[342px] sm:w-[492px] overflow-auto scrollbar-none min-h-screen sm:min-h-[694px]">
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
