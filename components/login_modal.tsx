import { authService, dbService } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { SetStateAction, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook } from "react-icons/gr";
import { SiNaver } from "react-icons/si";
import { MdOutlineClose } from "react-icons/md";
import { collection, getDocs, query, where } from "firebase/firestore";

const LoginModal = ({ isOpen, setIsOpen, setJoinIsOpen }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // email, password 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

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

  // 이메일 유효성 검사
  useEffect(() => {
    if (email) {
      if (email.match(emailRegEx) === null) {
        setEmail("이메일 형식을 확인해주세요.");
      } else {
        setEmail("");
      }
    }
  }, [email, setEmail]);

  return (
    <>
      <div className="w-screen h-screen fixed bg-slate-500 z-[9] opacity-90"></div>
      <div className="inner w-[588px] h-[820px] bg-white z-[10] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <MdOutlineClose
            onClick={() => setIsOpen(false)}
            className="absolute top-[32px] right-[32px] w-6 h-6 cursor-pointer duration-150 hover:text-red-400"
          />
          <h4 className="text-[40px] font-bold mt-[64px] mb-[42px]">로그인</h4>
          <form className="formContainer" onSubmit={signIn}>
            <div>
              <p className="w-[472px] m-auto mb-[6px] text-left">이메일</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                placeholder="이메일을 입력해주세요."
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm text-[#999999]">
                {email ? email : null}
              </p>
            </div>
            <div>
              <p className="w-[472px] m-auto mb-[6px] text-left">비밀번호</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="비밀번호를 입력해주세요."
                className="w-[472px] h-[44px] p-2 pl-4 mb-3 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className=" w-[472px] m-auto text-right text-gray-500 text-sm cursor-pointer duration-150 hover:text-[#FF6161]">
                비밀번호 찾기
              </p>
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
              <button className="w-[280px] h-[48px] mb-[29px] bg-[#FF6161] text-white rounded   ">
                로그인
              </button>
            </div>

            <p className="text-2xl font-bold mb-12 mt-[52px]">간편로그인</p>

            <div className="w-[473px] m-auto mb-[100px] flex items-center justify-center">
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
            <div className="w-[473px] m-auto flex justify-center text-sm">
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
