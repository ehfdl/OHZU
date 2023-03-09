import Image from "next/image";
import React from "react";

const ProfileGrade = ({ img, point }: { img: string; point: number }) => {
  return (
    <div
      className={`sm:hidden w-7 mx-3 aspect-square ${
        point < 30
          ? "bg-textGray"
          : point < 50
          ? " bg-primary"
          : "bg-profile_gold"
      } border-transparent rounded-full overflow-hidden p-[1.5px]`}
    >
      <Image
        src={img}
        width="28"
        height="28"
        alt="마이페이지"
        className="sm:hidden w-full h-full cursor-pointer object-cover rounded-full"
        priority={true}
      />
    </div>
  );
};

export default ProfileGrade;
