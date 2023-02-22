import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithCustomToken,
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
import { SiNaver, SiKakaotalk } from "react-icons/si";
import axios from "axios";

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

  // email, password, nickname 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/; // 최소 8자, 대문자 하나 이상, 소문자 하나 및 숫자 하나
  const nicknameRegEx = "^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$";

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
    return isCheckNickname;
  };

  // 닉네임 유효성 검사
  useEffect(() => {
    isNick(nickname)
      .then((result) => {
        if (nickname) {
          if (result === nickname) {
            setCheckNickname("이미 사용중인 닉네임입니다.");
          } else if (nickname.length > 5) {
            setCheckNickname("닉네임은 최대 다섯 글자입니다.");
          } else if (!nickname.match(nicknameRegEx)) {
            setCheckNickname("닉네임에 공백과 특수문자는 불가능합니다.");
          } else {
            setCheckNickname("사용 가능한 닉네임입니다.");
          }
        } else {
          setCheckNickname(" ");
        }
      })
      .catch((error) => {
        // alert(error.message)
      });
  }, [nickname, setNickname]);

  // 회원가입 빈칸 유효성
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

    // 회원가입 함수
    createUserWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
          userId: authService.currentUser?.uid,
          email: email,
          nickname: nickname,
          imageURL:
            "https://firebasestorage.googleapis.com/v0/b/oh-ju-79642.appspot.com/o/profile%2Fblank_profile.png?alt=media&token=0053da71-f478-44a7-ae13-320539bdf641",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
          alarm: [],
        });
        alert("회원가입 성공 !");
        setJoinIsOpen(false);
        setIsOpen(true);
      })
      .catch((error) => {
        // alert("다시 확인해주세요.");
        alert(error.massage);
      });
  };

  // 성인 인증 버튼
  const ageVerification = () => {
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    let newUserYear = Number(userYear);

    if (newUserYear === 0) {
      setCheckAdult("생년월일을 확인해주세요.");
    } else if (nowYear - newUserYear >= 19) {
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
          imageURL:
            "https://firebasestorage.googleapis.com/v0/b/oh-ju-79642.appspot.com/o/profile%2Fblank_profile.png?alt=media&token=0053da71-f478-44a7-ae13-320539bdf641",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
          alarm: [],
        });
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setJoinIsOpen(false);
      })
      .catch((error) => {
        // 이 부분에서는 오류를 처리합니다.
        const errorCode = error.code;
        const errorMessage = error.message;
        // 사용된 사용자 계정 이메일
        const email = error.customData.email;
        // AuthCredential 타입 제공됩니다.
        const credential = GoogleAuthProvider.credentialFromError(error);
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
          userId: authService.currentUser?.uid, // authService가 아닌 token값 중에 하나로 변경해야함. (구글도)
          email: token, // 실제 값은 이메일이 아닌 token으로 변경.
          nickname: result.user.displayName,
          imageURL:
            "https://firebasestorage.googleapis.com/v0/b/oh-ju-79642.appspot.com/o/profile%2Fblank_profile.png?alt=media&token=0053da71-f478-44a7-ae13-320539bdf641",
          introduce: "",
          point: "",
          following: [],
          follower: [],
          recently: [],
          alarm: [],
        });
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setJoinIsOpen(false);
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
  const loginFormWithKakao = () => {
    window.Kakao.Auth.login({
      success(authObj: any) {
        // 카카오 엑세스 토큰 확인용..
        // console.log("authObj : ", authObj);
        window.localStorage.setItem("token", authObj.access_token);
        axios({
          method: "POST",
          url: "http://localhost:3000/api/kakao",
          data: { authObj },
        }).then(function (response) {
          // 서버에서 보낸 jwt토큰을 받음
          console.log(response);
          localStorage.setItem("data", JSON.stringify(response.data));
          console.log("responseData", response.data);

          return signInWithCustomToken(
            authService,
            `${response.data.firebaseToken}`
          )
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("user : ", user);
              setDoc(
                doc(dbService, "Users", authService.currentUser?.uid as string),
                {
                  userId: authService.currentUser?.uid,
                  email: "",
                  nickname: "카카오",
                  imageURL:
                    "https://firebasestorage.googleapis.com/v0/b/oh-ju-79642.appspot.com/o/profile%2Fblank_profile.png?alt=media&token=0053da71-f478-44a7-ae13-320539bdf641",
                  introduce: "",
                  point: "",
                  following: [],
                  follower: [],
                  recently: [],
                  alarm: [],
                }
              );
              alert("카카오 간편 회원가입 성공!");
              setJoinIsOpen(false);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            });
        });
      },
      fail(err: any) {
        console.log("err :", err);
      },
    });
  };

  return (
    <>
      <div className="w-screen h-screen fixed bg-slate-500 z-[9] opacity-90"></div>
      <div className="inner w-[588px] h-[920px] bg-white z-[10] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="loginContainer flex-col text-center">
          <MdOutlineClose
            onClick={() => setJoinIsOpen(false)}
            className="absolute top-[32px] right-[32px] w-6 h-6 cursor-pointer duration-150 hover:text-red-400"
          />
          <h1 className="text-[40px] font-bold mt-[50px] mb-[19px]">
            회원가입
          </h1>
          <form className="formContainer" onSubmit={signUpForm}>
            <div>
              <p className="w-[472px] m-auto mb-[6px] text-left">이메일</p>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  isEmail;
                }}
                type="text"
                id="email"
                placeholder="실제 사용하는 이메일을 입력해주세요. "
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm text-[#999999]">
                {checkEmail ? checkEmail : null}
              </p>
            </div>
            <div>
              <p className="w-[472px] m-auto mb-[6px] text-left">비밀번호</p>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                placeholder="비밀번호는 최소 8자리로 입력해주세요."
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm text-[#999999]">
                {checkPassword}
              </p>
            </div>
            <p className="w-[472px] m-auto mb-[6px] text-left">비밀번호 확인</p>
            <div>
              <input
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
                type="password"
                id="pwCheck"
                placeholder="비밀번호 확인"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm text-[#999999]">
                {checkPasswordConfirm}
              </p>
            </div>
            <div>
              <p className="w-[472px] m-auto mb-[6px] text-left">닉네임</p>
              <input
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                type="text"
                id="nickname"
                placeholder="닉네임"
                className="w-[472px] h-[44px] p-2 pl-4 mb-1 bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-105"
              />
              <p className="w-[472px] m-auto mb-3 text-right text-sm text-[#999999]">
                {checkNickname}
              </p>
            </div>
            <div className="birth_Container">
              <p className="w-[472px] m-auto mb-[6px] text-left">생년월일</p>
              <div className="birth_input_Wrap w-[472px] m-auto mb-[2px] flex items-center justify-between">
                <input
                  onChange={(e) => {
                    setUserYear(e.target.value);
                  }}
                  type="text"
                  placeholder="YYYY"
                  className="w-[144px] h-11 text-center bg-[#F5F5F5]"
                />
                <input
                  onChange={(e) => {
                    setUserMonth(e.target.value);
                  }}
                  type="text"
                  placeholder="MM"
                  className="w-[144px] h-11 text-center bg-[#F5F5F5]"
                />
                <input
                  onChange={(e) => {
                    setUserDay(e.target.value);
                  }}
                  type="text"
                  placeholder="DD"
                  className="w-[144px] h-11 text-center bg-[#F5F5F5]"
                />
              </div>
              <div className="flex w-[472px] m-auto mb-7 ">
                <label htmlFor="auto_login" className="flex  items-center ">
                  <div
                    onClick={ageVerification}
                    id="auto_login"
                    className="px-2 py-1 border-1 text-sm cursor-pointer duration-150 hover:text-primary"
                  >
                    성인 인증하기
                    <span className="inline-block ml-[4px]">✅</span>
                  </div>
                  <span className="ml-2 text-sm ">
                    {!checkAdult ? " " : checkAdult}
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-[280px] h-[48px] mb-[29px] bg-primary text-white rounded"
            >
              회원가입
            </button>
            <p className="text-2xl font-bold mb-[33px]">소셜계정으로 로그인</p>
            <div className="w-[280px] m-auto mb-[24px] flex items-center  justify-around">
              <div onClick={googleJoin}>
                <FcGoogle className="w-10 h-10 border bg-black cursor-pointer" />
              </div>
              <div onClick={facebookJoin}>
                <GrFacebook className="w-10 h-10 ml-10 mr-10 border border-slate-400 cursor-pointer" />
              </div>
              {/* 네이버 로그인 구현 전 */}
              {/* <div>
                <SiNaver className="w-10 h-10 border border-slate-400 cursor-pointer" />
              </div> */}
              <div onClick={loginFormWithKakao}>
                <SiKakaotalk className="w-10 h-10 border bg-white cursor-pointer" />
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
