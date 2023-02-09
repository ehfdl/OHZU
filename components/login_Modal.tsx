import React from "react";
import { FcGoogle } from "react-icons/fc";

const LoginModal = () => {
  return (
    <>
      <div className="container w-screen h-screen fixed bg-slate-500 opacity-90"></div>
      <div className="inner w-80 h-96 bg-[#f2f2f2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <h4 className="text-2xl mt-14 mb-6">LOGIN</h4>
          <form className="formContainer">
            <div>
              <input
                type="text"
                id="email"
                placeholder="Email"
                className="w-52 p-2 pl-4 mb-2 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-52 p-2 pl-4 mb-6 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div className="buttonWrap mb-4">
              <button className="pt-1.5 pb-1.5 pl-3 pr-3 mr-4 border border-[#aaa] rounded-lg text-sm">
                Sign in
              </button>
              <button className="pt-1.5 pb-1.5 pl-3 pr-3 border border-[#aaa] rounded-lg text-sm">
                Sign up
              </button>
            </div>
            <button className="pt-1.5 pb-1.5 pl-3 pr-3 border border-[#aaa] rounded-lg text-sm">
              <div className="flex items-center">
                <FcGoogle className="w-6 h-6 mr-2" />
                Google
              </div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
