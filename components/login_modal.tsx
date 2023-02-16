import { authService } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { SetStateAction, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook } from "react-icons/gr";
import { SiNaver } from "react-icons/si";
import { MdOutlineClose } from "react-icons/md";

const LoginModal = ({ isOpen, setIsOpen, setJoinIsOpen }: any) => {
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
      <div className="inner w-[588px] h-[820px] bg-[#f2f2f2] z-[10] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <MdOutlineClose
            onClick={() => setIsOpen(false)}
            className="absolute top-[12px] right-[12px] w-10 h-10 cursor-pointer duration-150 hover:text-red-400"
          />
          <h4 className="text-4xl font-bold mt-14 mb-[42px]">로그인</h4>
          <form className="formContainer" onSubmit={signIn}>
            <div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                placeholder="이메일을 입력해주세요."
                className="w-[472px] h-[44px] p-2 pl-4 mb-[6px] bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="mb-[11px] mr-[58px] text-right text-sm">
                올바른 형식이 아닙니다.
              </p>
            </div>
            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="비밀번호를 입력해주세요."
                className="w-[472px] h-[44px] p-2 pl-4 mb-3 bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <div className="flex w-[472px] m-auto">
                <label
                  htmlFor="auto_login"
                  className="flex  items-center mb-[48px]"
                >
                  <input id="auto_login" type="checkbox" className="w-5 h-5" />
                  <span className="ml-2 ">자동 로그인</span>
                </label>
              </div>
            </div>
            <div className="buttonWrap mb-4">
              <button className="w-[472px] h-[52px] mb-3 bg-[#333] border-[#aaa] text-slate-100">
                로그인
              </button>
              <p className=" w-[472px] m-auto text-right text-gray-500 text-sm cursor-pointer">
                비밀번호 찾기
              </p>
            </div>

            <p className="text-2xl font-bold mb-12 mt-[52px]">간편로그인</p>

            <div className="w-[473px] m-auto flex items-center  justify-center">
              <div>
                <FcGoogle className="w-10 h-10 border bg-black cursor-pointer" />
              </div>
              <div>
                <GrFacebook className="w-10 h-10 ml-20 mr-20 border border-slate-400 cursor-pointer" />
              </div>
              <div>
                <SiNaver className="w-10 h-10 border border-slate-400 cursor-pointer" />
              </div>
            </div>
            <div className="w-[473px] m-auto mt-[100px] flex justify-center text-sm">
              <p className="text-slate-400 mr-1">아직 회원이 아니신가요?</p>
              <span
                onClick={() => {
                  setIsOpen(false);
                  setJoinIsOpen(true);
                }}
                className="cursor-pointer"
              >
                회원가입
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
