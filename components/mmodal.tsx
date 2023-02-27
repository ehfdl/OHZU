import React from "react";

const Mmodal = ({
  setConfirmed,
  setopenMmodal,
}: {
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setopenMmodal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]" />
      <div className="w-[588px] h-[400px] rounded bg-white z-40 flex flex-col justify-start items-center">
        <div className="w-full flex justify-around mt-10 text-[24px]">
          <button onClick={() => setopenMmodal(false)}>닫기</button>
          <button onClick={() => setConfirmed(true)}>이동하기</button>
        </div>
      </div>
    </div>
  );
};

export default Mmodal;
