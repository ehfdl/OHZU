import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { authService, dbService } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

// import axios from "axios";

const JoinModal = () => {
  // 이메일, 비밀번호, 비밀번호 확인, 닉네임
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  // 이메일, 비밀번호, 닉네임 유효성 검사
  const [isEmail, setIsEmail] = useState("");
  const [isPassword, setIsPassword] = useState("");
  const [isNickname, setIsNickname] = useState("");

  // 회원가입 모달 상태 on/off 유무
  const [joinOpen, setJoinOpen] = useState(false);

  // email, password 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  // const emailCheck = (email: any) => {
  //   return emailRegEx.test(email);
  // };

  const uid = authService.currentUser?.uid;
  const currentUser = authService.currentUser;
  console.log("currentUser : ", currentUser);

  console.log("email : ", email);
  console.log("password : ", password);

  const signUpForm = (e: any) => {
    e.preventDefault();
    createUserWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        console.log("회원가입 성공 ! :", authService.currentUser?.uid);
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          user: authService.currentUser?.uid,
        });
        alert("회원가입 성공 !");
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  const closeModal = () => {
    setJoinOpen(false);
  };

  return (
    <>
      <div className="container w-screen h-screen fixed bg-slate-500 opacity-90"></div>
      <div className="inner w-80 h-96 bg-[#f2f2f2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <h4 className="text-2xl mt-10 mb-6">REGISTER</h4>
          <form className="formContainer" onClick={signUpForm}>
            <div>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                id="email"
                placeholder="Email"
                className="w-52 p-2 pl-4 mb-2.5 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                placeholder="Password"
                className="w-52 p-2 pl-4 mb-2.5 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div>
              <input
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
                type="password"
                id="pwCheck"
                placeholder="Confirm Password"
                className="w-52 p-2 pl-4 mb-2.5 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <div>
              <input
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                type="text"
                id="nickname"
                placeholder="Nickname"
                className="w-52 p-2 pl-4 mb-8 bg-gray-300 placeholder:text-[#666] text-sm rounded-lg duration-300 focus:scale-105"
              />
            </div>
            <button
              type="submit"
              onClick={() => {}}
              className="pt-1.5 pb-1.5 pl-3 pr-3 mr-4 border border-[#aaa] rounded-lg text-sm"
            >
              <div className="flex items-center">Sign up</div>
            </button>
            <button
              onClick={closeModal}
              className="pt-1.5 pb-1.5 pl-3 pr-3 border border-[#d0d0d0] rounded-lg text-sm bg-[#d0d0d0] text-[#aaa]"
            >
              <div className="flex items-center">Cancel</div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinModal;
