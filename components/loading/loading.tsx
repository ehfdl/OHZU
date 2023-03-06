import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../animation/loading_spinner.json";

const Loading = () => {
  return (
    <>
      <div className="w-screen h-screen relative">
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        />
      </div>
    </>
  );
};

export default Loading;
