import Image from "next/image";
import React from "react";

const Grade = ({ score }: { score: number }) => {
  if (score < 21) {
    const rank = "/badge/badge-bronze.png";

    return (
      <Image
        className="w-3 h-[15px] sm:w-[18px] sm:h-[22px]"
        src={rank}
        width={12}
        height={15}
        alt=""
      />
    );
  } else if (score < 31) {
    const rank = "/badge/badge-silver.png";

    return (
      <Image
        className="w-3 h-[15px] sm:w-[18px] sm:h-[22px]"
        src={rank}
        width={12}
        height={15}
        alt=""
      />
    );
  } else {
    const rank = "/badge/badge-gold.png";

    return (
      <Image
        className="w-3 h-[15px] sm:w-[18px] sm:h-[22px]"
        src={rank}
        width={12}
        height={15}
        alt=""
      />
    );
  }
};

export default Grade;
