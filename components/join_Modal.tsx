import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { authService, dbService } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { MdOutlineClose } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook } from "react-icons/gr";
import { SiNaver } from "react-icons/si";
import { async } from "@firebase/util";

const JoinModal = ({ joinIsOpen, setJoinIsOpen, isOpen, setIsOpen }: any) => {
  // 이메일, 비밀번호, 비밀번호 확인, 닉네임, 유저 생년월일
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [userYear, setUserYear] = useState("");
  const [userMonth, setUserMonth] = useState("");
  const [userDay, setUserDay] = useState("");

  // 이메일, 비밀번호, 닉네임 유효성 검사
  const [checkEmail, setCheckEmail] = useState("");
  const [boolEmail, setBoolEmail] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [checkPasswordConfirm, setCheckPasswordConfirm] = useState("");
  const [checkNickname, setCheckNickname] = useState("");

  // 이메일, 비밀번호, 닉네임 정규식 상태관리
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // email, password 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/; // 최소 8자, 대문자 하나 이상, 소문자 하나 및 숫자 하나

  // 이메일 중복검사 (FireStore <=> email input)
  const isEmail = async (email: any) => {
    const q = query(
      collection(dbService, "Users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    let isCheckEmail = "";

    querySnapshot.forEach((doc) => {
      isCheckEmail = doc.data().email;
    });
    console.log("checkEmail", checkEmail);
    return isCheckEmail;
  };

  useEffect(() => {
    isEmail(email)
      .then((result) => {
        if (email) {
          if (result === email) {
            setCheckEmail("사용중인 이메일입니다.");
          } else if (email.match(emailRegEx) === null) {
            setCheckEmail("이메일 형식을 확인해주세요.");
          } else {
            setCheckEmail("사용 가능한 이메일입니다.");
          }
        } else {
          setCheckEmail("이메일을 작성해주세요.");
        }
      })
      .catch((error) => {
        console.log("error : ", error);
        setCheckEmail("이메일 중복 확인 중 오류가 발생했습니다.");
      });
  }, [email, setCheckEmail]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (!password) {
      setCheckPassword("비밀번호를 입력해주세요.");
    } else if (!(password.length >= 8 && password.match(passwordRegEx))) {
      setCheckPassword("비밀번호 형식이 맞지 않습니다.");
    } else if (password.length >= 8 && password.match(passwordRegEx)) {
      setCheckPassword("통과");
    } else if (passwordConfirm !== password) {
      setCheckPasswordConfirm("비밀번호가 다릅니다.");
    } else {
      setCheckPasswordConfirm("통과2");
    }
  }, [password]);

  useEffect(() => {
    if (passwordConfirm !== "") {
      if (passwordConfirm !== password) {
        setCheckPasswordConfirm("비밀번호가 다릅니다.");
      } else {
        setCheckPasswordConfirm("통과2");
      }
    }
  }, [passwordConfirm]);

  const signUpForm = (e: any) => {
    e.preventDefault();

    createUserWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        console.log("회원가입 성공 ! :", authService.currentUser?.uid);
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          userId: authService.currentUser?.uid,
          email: email,
          nickname: nickname,
          imageURL: "",
          introduce: "",
          rank: "",
          point: "",
          following: [],
          follower: [],
          introduce: "",
        });
        alert("회원가입 성공 !");
        setJoinIsOpen(false);
        setIsOpen(true);
      })
      .catch((error) => {
        alert(error.massage);
      });
  };

  console.log("password :");
  return (
    <>
      <div className="w-screen h-screen fixed bg-slate-500 z-[1] opacity-90"></div>
      <div className="inner w-[588px] h-[880px] bg-[#f2f2f2] z-[10] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <MdOutlineClose
            onClick={() => setJoinIsOpen(false)}
            className="absolute top-[12px] right-[12px] w-8 h-8 cursor-pointer duration-150 hover:text-red-400"
          />
          <h4 className="text-4xl font-bold mt-[72px] mb-[42px]">회원가입</h4>
          <form className="formContainer" onSubmit={signUpForm}>
            <div>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  isEmail;
                }}
                type="text"
                id="email"
                placeholder="Email"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm">
                {checkEmail ? checkEmail : null}
                {checkEmail.match(emailRegEx) ? null : regEmail}
              </p>
            </div>
            <div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                placeholder="Password"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm">
                {checkPassword}
              </p>
            </div>
            <div>
              <input
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
                type="password"
                id="pwCheck"
                placeholder="Confirm Password"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm">
                {checkPasswordConfirm}
              </p>
            </div>
            <div>
              <input
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                type="text"
                id="nickname"
                placeholder="Nickname"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-gray-300 placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm">
                {nickname}
              </p>
            </div>
            <div className="birth_Container">
              <div className="birth_input_Wrap w-[472px] m-auto mb-3 flex items-center justify-between">
                <input
                  onChange={(e) => {
                    setUserYear(e.target.value);
                  }}
                  type="text"
                  placeholder="출생년도"
                  className="w-[144px] h-11"
                />
                <input
                  onChange={(e) => {
                    setUserMonth(e.target.value);
                  }}
                  type="text"
                  placeholder="월"
                  className="w-[144px] h-11"
                />
                <input
                  onChange={(e) => {
                    setUserDay(e.target.value);
                  }}
                  type="text"
                  placeholder="일"
                  className="w-[144px] h-11"
                />
              </div>
              <div className="flex w-[472px] m-auto">
                <label htmlFor="auto_login" className="flex  items-center mb-4">
                  <input id="auto_login" type="checkbox" className="w-5 h-5" />
                  <span className="ml-2 text-sm ">19세 이상 성인입니다.</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              onClick={() => {}}
              className="w-[472px] h-[52px] mb-[27px] bg-[#333] border-[#aaa] text-slate-100"
            >
              회원가입
            </button>
            <p className="text-2xl font-bold mb-12">간편 회원가입</p>
            <div className="w-[473px] m-auto mb-[31px] flex items-center  justify-center">
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
              <p className="text-slate-400 mr-1">이미 계정이 있으신가요?</p>
              <span
                onClick={() => {
                  setIsOpen(true);
                  setJoinIsOpen(false);
                }}
                className="cursor-pointer"
              >
                로그인
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinModal;
