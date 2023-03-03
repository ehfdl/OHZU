import useModal from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import FollowModalCard from "../sub_page/follow_modal_card";

export interface FollowModalProps {
  defaultfollow?: string;
  usersFollowerProfile?: UserType[];
  usersFollowingProfile?: UserType[];
  myProfile?: any;
  getMyProfile?: () => Promise<void>;
}

const FollowModal = ({
  defaultfollow,
  usersFollowerProfile,
  usersFollowingProfile,
  myProfile,
  getMyProfile,
}: FollowModalProps) => {
  const { hideModal } = useModal();
  const [follow, setFollow] = useState(defaultfollow);
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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10">
      <div className="w-full h-full relative sm:w-[588px] sm:h-[820px] rounded bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="sm:w-10 w-8 aspect-square absolute top-5 right-3"
          onClick={() => hideModal()}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>
        <div className="w-full flex justify-around mt-10 text-lg sm:text-[24px]">
          <label
            onChange={() => {
              setFollow("follower");
            }}
            className="w-1/2 text-slate-500 text-center"
          >
            <input
              type="radio"
              name="follow"
              value="follower"
              defaultChecked={follow === "follower"}
              className="hidden peer"
            />
            <span className="w-full block cursor-pointer py-4 sm:py-5 border-b-[1px] border-second peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
              팔로워
            </span>
          </label>
          <label
            onChange={() => {
              setFollow("following");
            }}
            className="w-1/2 text-slate-500 text-center"
          >
            <input
              type="radio"
              name="follow"
              value="following"
              className="hidden peer"
              defaultChecked={follow === "following"}
            />
            <span className="w-full block cursor-pointer py-4 sm:py-5  border-b-[1px] border-second peer-checked:font-bold  peer-checked:border-b-4 peer-checked:text-primary peer-checked:border-primary">
              팔로잉
            </span>
          </label>
        </div>

        <div className="flex px-2 pt-8 sm:pt-10 flex-col gap-6 justify-start items-center w-full sm:w-[492px] overflow-auto scrollbar-none">
          {follow === "following" && usersFollowingProfile
            ? usersFollowingProfile.map(
                (profile) =>
                  getMyProfile && (
                    <FollowModalCard
                      key={profile.userId}
                      profile={profile}
                      myProfile={myProfile}
                      getMyProfile={getMyProfile}
                    />
                  )
              )
            : follow === "follower" && usersFollowerProfile
            ? usersFollowerProfile.map(
                (profile) =>
                  getMyProfile && (
                    <FollowModalCard
                      key={profile.userId}
                      profile={profile}
                      myProfile={myProfile}
                      getMyProfile={getMyProfile}
                    />
                  )
              )
            : null}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
