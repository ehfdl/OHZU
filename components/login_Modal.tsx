import { authService } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { SetStateAction, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineClose } from "react-icons/md";

const LoginModal = ({ isOpen, setIsOpen }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("email : ", email);
  console.log("password : ", password);

  console.log(" isOpen : ", isOpen);
  // 로그인 함수
  const signIn = (e: any) => {
    e.preventDefault();

    signInWithEmailAndPassword(authService, email, password).then(
      (userCredential) => {
        console.log("로그인 성공!");
        setIsOpen(false);
      }
    );
  };

  return (
    <>
      <div className="w-screen h-screen fixed bg-slate-500 z-[1] opacity-90"></div>
      <div className="inner w-80 h-96 bg-[#f2f2f2] z-[10] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <MdOutlineClose
            onClick={() => setIsOpen(false)}
            className="absolute top-[12px] right-[12px] w-8 h-8 cursor-pointer duration-150 hover:text-red-400"
          />
          <h4 className="text-2xl mt-14 mb-6">LOGIN</h4>
          <form className="formContainer" onSubmit={signIn}>
            <div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                placeholder="Email"
                className="w-52 p-2 pl-4 mb-2 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
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
