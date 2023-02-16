import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  authService,
  dbService,
  providerFacebook,
  providerGoogle,
} from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { MdOutlineClose } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook } from "react-icons/gr";
import { SiNaver } from "react-icons/si";
import Link from "next/link";

declare global {
  interface Window {
    Kakao: any;
  }
}

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
  const [checkPassword, setCheckPassword] = useState("");
  const [checkPasswordConfirm, setCheckPasswordConfirm] = useState("");
  const [checkNickname, setCheckNickname] = useState("");
  const [checkAdult, setCheckAdult] = useState("");

  // email, password 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/; // 최소 8자, 대문자 하나 이상, 소문자 하나 및 숫자 하나

  // 카카오 앱 키
  const kakaoAppKey = process.env.NEXT_PUBLIC_VITE_KAKAO_JAVASCRIPT_KEY;

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
    return isCheckEmail;
  };

  // 이메일 유효성 검사
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
          setCheckEmail(" ");
        }
      })
      .catch((error) => {
        alert(error.message);
        // setCheckEmail("이메일 중복 확인 중 오류가 발생했습니다.");
      });
  }, [email, setCheckEmail]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (!password) {
      setCheckPassword("");
    } else if (!(password.length >= 8 && password.match(passwordRegEx))) {
      setCheckPassword(
        "비밀번호는 최소8자리, 특수문자와 대문자, 소문자, 숫자로 작성하세요."
      );
    } else if (password.length >= 8 && password.match(passwordRegEx)) {
      setCheckPassword("성공!");
    } else if (passwordConfirm !== password) {
      setCheckPasswordConfirm("비밀번호가 다릅니다.");
    }
  }, [password]);

  useEffect(() => {
    if (passwordConfirm !== "") {
      if (passwordConfirm !== password) {
        setCheckPasswordConfirm("비밀번호가 다릅니다.");
      } else {
        setCheckPasswordConfirm("비밀번호가 일치합니다.");
      }
    }
  }, [passwordConfirm]);

  // 닉네임 중복검사 (FireStore <=> nickname input)
  const isNick = async (nickname: any) => {
    const q = query(
      collection(dbService, "Users"),
      where("nickname", "==", nickname)
    );
    const querySnapshot = await getDocs(q);

    let isCheckNickname = "";

    querySnapshot.forEach((doc) => {
      isCheckNickname = doc.data().nickname;
    });
    console.log("checkNickname", checkNickname);
    return isCheckNickname;
  };

  // 닉네임 유효성 검사
  useEffect(() => {
    isNick(nickname)
      .then((result) => {
        if (nickname) {
          if (result === nickname) {
            setCheckNickname("사용중인 닉네임입니다.");
          } else {
            setCheckNickname("사용 가능한 닉네임입니다.");
          }
        } else {
          setCheckNickname(" ");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [nickname, setNickname]);

  const signUpForm = (e: any) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !passwordConfirm ||
      !nickname ||
      !userYear ||
      !userMonth ||
      !userDay
    ) {
      return alert("빈칸을 채워주세요.");
    }

    createUserWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          userId: authService.currentUser?.uid,
          email: email,
          nickname: nickname,
          imageURL: "",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
        });
        alert("회원가입 성공 !");
        setJoinIsOpen(false);
        setIsOpen(true);
      })
      .catch((error) => {
        // alert("다시 확인해주세요.");
        // console.log("error.massage : ", error.massage);
        alert(error.massage);
      });
  };

  // 성인 인증 버튼
  const ageVerification = () => {
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    let newUserYear = Number(userYear);
    console.log("newUserYear : ", newUserYear);

    if (newUserYear === 0) {
      setCheckAdult("출생년도와 태어난 월, 일을 입력해주세요.");
    } else if (nowYear - newUserYear > 20) {
      setCheckAdult("성인입니다.");
    } else {
      setCheckAdult("성인이 아닙니다. 서비스 이용이 불가합니다.");
    }
  };

  // 간편 로그인
  // 구글 -> uid 생성 후, setDoc으로 document 생성하여 유저 추가.
  const googleJoin = () => {
    signInWithPopup(authService, providerGoogle)
      .then((result) => {
        // 다음은 구글 액세스 토큰을 발급하는 코드입니다. 이 토큰을 사용하여 구글 API에 접근할 수 있습니다.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          userId: authService.currentUser?.uid,
          email: token, // 실제 값은 이메일이 아닌 token으로 변경.
          nickname: result.user.displayName,
          imageURL: "",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
        });
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setJoinIsOpen(false);
        console.log("result : ", result);
      })
      .catch((error) => {
        // 이 부분에서는 오류를 처리합니다.
        const errorCode = error.code;
        const errorMessage = error.message;
        // 사용된 사용자 계정 이메일
        const email = error.customData.email;
        // AuthCredential 타입 제공됩니다.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("error : ", error);
      });
  };

  // 페이스북
  const facebookJoin = () => {
    signInWithPopup(authService, providerFacebook)
      .then((result) => {
        // 다음은 구글 액세스 토큰을 발급하는 코드입니다. 이 토큰을 사용하여 구글 API에 접근할 수 있습니다.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          userId: authService.currentUser?.uid,
          email: token, // 실제 값은 이메일이 아닌 token으로 변경.
          nickname: result.user.displayName,
          imageURL: "",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
        });
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setJoinIsOpen(false);
        console.log("result : ", result);
      })
      .catch((error) => {
        // 이 부분에서는 오류를 처리합니다.
        const errorCode = error.code;
        const errorMessage = error.message;
        // 사용된 사용자 계정 이메일
        const email = error.customData.email;
        // AuthCredential 타입 제공됩니다.
        const credential = FacebookAuthProvider.credentialFromError(error);
        alert(error);
      });
  };

  // 카카오
  // const kakaoJoin = () => {
  //   if (!window.Kakao.isInitialized()) {
  //     window.Kakao.init(kakaoAppKey);
  //   }

  //   const redirectUri = `${location.origin}/callback/kakaotalk`;
  // const scope = [
  //   KAKAO_SCOPE_NICKNAME,
  //   KAKAO_SCOPE_GENDER,
  //   KAKAO_SCOPE_BIRTHDAY,
  // ].join(",");

  // window.Kakao.Auth.authorize({
  //   redirectUri,
  //   scope,
  // });
  //   // return alert("실행됩니다.");
  // };

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
                {checkNickname}
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
                  className="w-[144px] h-11 text-center"
                />
                <input
                  onChange={(e) => {
                    setUserMonth(e.target.value);
                  }}
                  type="text"
                  placeholder="월"
                  className="w-[144px] h-11 text-center"
                />
                <input
                  onChange={(e) => {
                    setUserDay(e.target.value);
                  }}
                  type="text"
                  placeholder="일"
                  className="w-[144px] h-11 text-center"
                />
              </div>
              <div className="flex w-[472px] m-auto">
                <label htmlFor="auto_login" className="flex  items-center mb-4">
                  <div
                    onClick={ageVerification}
                    id="auto_login"
                    className="px-2 py-1 border-1 bg-[#aaa] text-sm cursor-pointer duration-150 hover:bg-[#333] hover:text-slate-50"
                  >
                    성인 인증하기
                  </div>
                  <span className="ml-2 text-sm ">
                    {!checkAdult ? " " : checkAdult}
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-[472px] h-[52px] mb-[27px] bg-[#333] border-[#aaa] text-slate-100"
            >
              회원가입
            </button>
            <p className="text-2xl font-bold mb-12">간편 회원가입</p>
            <div className="w-[473px] m-auto mb-[31px] flex items-center  justify-center">
              <div onClick={googleJoin}>
                <FcGoogle className="w-10 h-10 border bg-black cursor-pointer" />
              </div>
              <div onClick={facebookJoin}>
                <GrFacebook className="w-10 h-10 ml-20 mr-20 border border-slate-400 cursor-pointer" />
              </div>
              <div>
                <SiNaver className="w-10 h-10 border border-slate-400 cursor-pointer" />
              </div>
              <div>
                <Link href="https://http://localhost:3000/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API}&redirect_uri=https://localhost:3000">
                  카카오로 회원가입하기
                </Link>
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
