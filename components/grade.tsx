import Image from "next/image";
import React from "react";

const Grade = ({ score }: { score: number }) => {
  if (score < 21) {
    const rank = "/badge/badge-bronze.png";

    return (
      <Image
        className="w-full object-cover"
        src={rank}
        width={18}
        height={22}
        alt=""
      />
    );
  } else if (score < 31) {
    const rank = "/badge/badge-silver.png";

    return (
      <Image
        className="w-full object-cover"
        src={rank}
        width={18}
        height={22}
        alt=""
      />
    );
  } else {
    const rank = "/badge/badge-gold.png";

    return (
      <Image
        className="w-full object-cover"
        src={rank}
        width={18}
        height={22}
        alt=""
      />
    );
  }
};

export default Grade;
