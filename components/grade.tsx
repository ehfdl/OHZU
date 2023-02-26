import React from "react";

const Grade = ({ score }: { score: number }) => {
  if (score < 21) {
    const rank = "/badge/badge-bronze.png";

    return <img src={rank} />;
  } else if (score < 31) {
    const rank = "/badge/badge-silver.png";

    return <img src={rank} />;
  } else {
    const rank = "/badge/badge-gold.png";

    return <img src={rank} />;
  }
};

export default Grade;
