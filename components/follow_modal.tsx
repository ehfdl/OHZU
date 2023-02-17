import React from "react";
import { FiX } from "react-icons/fi";

const FollowModal = ({
  setIsOpenFollowModal,
}: {
  setIsOpenFollowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)]" />
      <div className="w-[588px] h-[820px] bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="w-10 aspect-square absolute mt-7 ml-[500px]"
          onClick={() => setIsOpenFollowModal(false)}
        >
          <FiX className="w-full h-full text-[#acacac]" />
        </button>

        <div className="text-[40px] font-bold border-b-4 w-[160px] text-center  border-[#ff6161] mt-[88px]">
          팔로잉
        </div>
        <div className="flex pt-12 flex-col gap-5 justify-start items-center w-[492px] overflow-auto scrollbar-none">
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
          <div className="w-full flex justify-start bg-white">
            <div className="w-[78px] aspect-square rounded-full bg-[#d9d9d9]">
              <img />
            </div>
            <div className="flex flex-col ml-5 my-[2px]">
              <div className="font-bold">닉네임</div>
              <div className="text-sm max-h-11 w-[268px] mt-1 text-ellipsis overflow-hidden">
                거친 안고, 바이며, 그들은 청춘에서만 것은 얼마나 모래뿐일 인간의
                약동하다.그들은 청춘에서만 것은 얼마나 모래뿐일 인간의 약동하다.
              </div>
            </div>
            <button className="ml-[14px] w-28 h-[30px] rounded-[50px] bg-[#f5f7fa] text-[#d8d8e2]">
              팔로잉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
