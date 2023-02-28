import {
  apiKey,
  authService,
  dbService,
  providerFacebook,
  providerGoogle,
} from "@/firebase";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { SetStateAction, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook } from "react-icons/gr";
import { MdOutlineClose } from "react-icons/md";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SiNaver, SiKakaotalk } from "react-icons/si";
import axios from "axios";
import Image from "next/image";

const LoginModal = ({ isOpen, setIsOpen, setJoinIsOpen }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);

  // save email

  const SAVE_EMAIL_ID_KEY = "SAVE_EMAIL_ID_KEY";
  const SAVE_EMAIL_ID_CHECKED_KEY = "SAVE_EMAIL_ID_CHECKED_KEY";

  const [checkedSaveEmail, setCheckedSaveEmail] = useState(false);

  // email, password 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  // 로그인 함수
  const signIn = (e: any) => {
    e.preventDefault();

    signInWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        const user = authService;

        if (user.currentUser?.emailVerified) {
          localStorage.setItem(SAVE_EMAIL_ID_CHECKED_KEY, checkedSaveEmail);
          if (checkedSaveEmail) {
            localStorage.setItem(SAVE_EMAIL_ID_KEY, email);
          }
          sessionStorage.setItem(
            apiKey as string,
            authService.currentUser?.uid as string
          );
          setIsOpen(false);
        } else {
          alert(
            "인증이 되지 않은 사용자입니다. 서비스 이용에 제한이 있습니다."
          );
          if (authService.currentUser !== null) {
            signOut(authService);
          }
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          alert("가입되지 않은 회원입니다.");
          return;
        } else if (errorMessage.includes("wrong-password")) {
          alert("비밀번호가 잘못 되었습니다.");
        }
      });
  };

  // 이메일 유효성 검사
  useEffect(() => {
    if (email) {
      if (email.match(emailRegEx) === null) {
        setEmail("이메일 형식을 확인해주세요.");
      }
    }
  }, [setEmail]);

  // 비밀번호 재설정 함수 (비밀번호 찾기)
  const resetPassword = () => {
    if (email !== "") {
      sendPasswordResetEmail(authService, email)
        .then(function () {
          console.log("비밀번호 리셋, 이메일 전송 완료");
        })
        .catch(function (error: any) {
          const errorMessage = error.message;
          if (errorMessage.includes("user-not-found")) {
            alert("가입되지 않은 이메일입니다.");
          }
        });
    } else {
      console.log("이메일이 틀림,");
    }
  };

  // 간편 로그인
  // 구글 -> uid 생성 후, setDoc으로 document 생성하여 유저 추가.
  const googleJoin = () => {
    signInWithPopup(authService, providerGoogle)
      .then(async (result: any) => {
        // 다음은 구글 액세스 토큰을 발급하는 코드입니다. 이 토큰을 사용하여 구글 API에 접근할 수 있습니다.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        sessionStorage.setItem(
          apiKey as string,
          authService.currentUser?.uid as string
        );

        const snapshot = await getDoc(
          doc(dbService, "Users", authService.currentUser?.uid as string)
        );
        const snapshotdata = await snapshot.data();
        const newProfile = {
          ...snapshotdata,
        };

        if (!newProfile.userId) {
          setDoc(doc(dbService, "Users", `${authService.currentUser?.uid}`), {
            alarm: [],
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
          });
        }

        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setIsOpen(false);
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
      .then(async (result) => {
        // 다음은 구글 액세스 토큰을 발급하는 코드입니다. 이 토큰을 사용하여 구글 API에 접근할 수 있습니다.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        sessionStorage.setItem(
          apiKey as string,
          authService.currentUser?.uid as string
        );

        const snapshot = await getDoc(
          doc(dbService, "Users", authService.currentUser?.uid as string)
        );
        const snapshotdata = await snapshot.data();
        const newProfile = {
          ...snapshotdata,
        };

        if (!newProfile.userId) {
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
          });
        }
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        setIsOpen(false);
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

  // 카카오 로그인
  const loginFormWithKakao = () => {
    window.Kakao.Auth.login({
      success(authObj: any) {
        // 카카오 엑세스 토큰 조회
        // console.log("로그인 모달 authObj : ", authObj);
        window.localStorage.setItem("token", authObj.access_token);
        axios({
          method: "POST",
          url: "https://ohzu.vercel.app/api/kakao",
          data: { authObj },
        }).then(function (response: any) {
          // 서버에서 보낸 jwt토큰을 받음
          // console.log("로그인 모달 : ", response);
          localStorage.setItem("data", JSON.stringify(response.data));
          // console.log("로그인 모달 responseData", response.data);

          return signInWithCustomToken(
            authService,
            `${response.data.firebaseToken}`
          )
            .then(async (userCredential: any) => {
              const user = userCredential.user;

              sessionStorage.setItem(
                apiKey as string,
                authService.currentUser?.uid as string
              );

              const snapshot = await getDoc(
                doc(dbService, "Users", authService.currentUser?.uid as string)
              );
              const snapshotdata = await snapshot.data();
              const newProfile = {
                ...snapshotdata,
              };

              if (!newProfile.userId) {
                setDoc(
                  doc(
                    dbService,
                    "Users",
                    authService.currentUser?.uid as string
                  ),
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
              }

              setIsOpen(false);
            })
            .catch((error: any) => {
              const errorCode = error.code;
              const errorMessage =
                error.message("⛔️ 다시 로그인을 시도해주세요.");
              alert(errorMessage);
            });
        });
      },
      fail(err: any) {
        console.log("err :", err);
      },
    });
  };

  useEffect(() => {
    let localEmailChecked = JSON.parse(
      localStorage.getItem(SAVE_EMAIL_ID_CHECKED_KEY) as string
    );

    if (!localEmailChecked) {
      localStorage.setItem(SAVE_EMAIL_ID_KEY, "");
    }

    let localEmail = localStorage.getItem(SAVE_EMAIL_ID_KEY);

    if (localEmail !== null) {
      setEmail(localEmail);
    }
    if (localEmailChecked) {
      setCheckedSaveEmail(true);
    }

    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);
  console.log("email", email);

  return (
    <>
      <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center ">
        <div className="w-full h-full fixed left-0 top-0 z-[9] bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]" />
        <div className="inner max-w-[588px] w-full max-h-[820px] h-full bg-white z-[10] fixed top-1/2 left-1/2 rounded transform -translate-x-1/2 -translate-y-1/2">
          <div className="loginContainer flex-col text-center">
            <MdOutlineClose
              onClick={() => setIsOpen(false)}
              className="absolute top-[32px] right-[32px] w-6 h-6 cursor-pointer duration-150 hover:text-red-400"
            />
            <h4 className="text-[40px] font-bold mt-[64px] mb-[42px]">
              로그인
            </h4>
            <form className="formContainer" onSubmit={signIn}>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  이메일
                </p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  id="email"
                  defaultValue={email}
                  placeholder="이메일을 입력해주세요."
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-4 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                />
                {/* <p className=" w-[472px] m-auto mb-3 text-right text-sm text-[#999999]"></p> */}
              </div>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  비밀번호
                </p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력해주세요."
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-3 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                />
                <p
                  onClick={() => {
                    setModal(true);
                  }}
                  className=" w-[472px] m-auto text-right text-gray-500 text-sm cursor-pointer duration-150 hover:text-primary"
                >
                  비밀번호 찾기
                </p>

                <div className="flex w-[472px] m-auto">
                  <label
                    htmlFor="auto_login"
                    className="flex  items-center mb-[48px]"
                  >
                    <input
                      id="saveEmail"
                      name="saveEmail"
                      type="checkbox"
                      checked={checkedSaveEmail}
                      className="w-5 h-5 cursor-pointer"
                      onChange={() => setCheckedSaveEmail(!checkedSaveEmail)}
                    />
                    <span className="ml-2 ">이메일 저장하기</span>
                  </label>
                </div>
              </div>

              <div>
                <span>비밀번호 재설정</span>
                <input
                  type="text"
                  placeholder="재설정 코드를 받을 이메일을 입력하세요."
                  onChange={(e) => setEmail(e.target.value)}
                  className="border bg-red-200"
                />
                <div onClick={resetPassword}>♥️</div>
              </div>

              <div className="buttonWrap mb-4">
                <button className="w-[280px] h-[48px] mb-[29px] bg-primary text-white rounded   ">
                  로그인
                </button>
              </div>

              <p className="text-2xl font-bold mb-12 mt-[52px]">
                소셜계정으로 로그인
              </p>

              <div className="w-[280px] m-auto mb-[24px] flex items-center  justify-around">
                <div onClick={googleJoin}>
                  <Image
                    src="/image/google.svg"
                    width="40"
                    height="40"
                    alt="구글 로그인"
                    className="cursor-pointer"
                  />
                </div>
                <div onClick={facebookJoin}>
                  <Image
                    src="/image/facebook.svg"
                    width="40"
                    height="40"
                    alt="페이스북 로그인"
                    className="cursor-pointer"
                  />
                </div>
                {/* 네이버 로그인 구현 전 */}
                {/* <div>
                <SiNaver className="w-10 h-10 border border-slate-400 cursor-pointer" />
              </div> */}
                <div onClick={loginFormWithKakao}>
                  <Image
                    src="/image/kakao.svg"
                    width="40"
                    height="40"
                    alt="카카오 로그인"
                    className="cursor-pointer"
                  />
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
      </div>
    </>
  );
};

export default LoginModal;
