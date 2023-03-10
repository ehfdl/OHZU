import {
  apiKey,
  authService,
  dbService,
  providerFacebook,
  providerGoogle,
} from "@/firebase";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import useModal from "@/hooks/useModal";
import Image from "next/image";
import FindPassword from "../find_password";

export interface LoginModalProps {}

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState("");

  const [findPassword, setFindPassword] = useState(false);
  const [mobileOption, setMobileOption] = useState(false);

  // join modal open
  const { showModal, hideModal } = useModal();
  // save email
  const SAVE_EMAIL_ID_KEY = "SAVE_EMAIL_ID_KEY";
  const SAVE_EMAIL_ID_CHECKED_KEY = "SAVE_EMAIL_ID_CHECKED_KEY";

  const [checkedSaveEmail, setCheckedSaveEmail] = useState<boolean | string>(
    false
  );

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
          localStorage.setItem(
            SAVE_EMAIL_ID_CHECKED_KEY,
            checkedSaveEmail as string
          );
          if (checkedSaveEmail) {
            localStorage.setItem(SAVE_EMAIL_ID_KEY, email);
          }
          sessionStorage.setItem(
            apiKey as string,
            authService.currentUser?.uid as string
          );
          hideModal();
        } else {
          showModal({
            modalType: "AlertModal",
            modalProps: {
              title: "로그인 실패",
              text: "인증이 되지 않은 사용자입니다. 서비스 이용에 제한이 있습니다.",
            },
          });
          if (authService.currentUser !== null) {
            signOut(authService);
          }
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          showModal({
            modalType: "AlertModal",
            modalProps: {
              title: "로그인 실패",
              text: "가입되지 않은 회원입니다.",
              btnfunc: () =>
                showModal({ modalType: "LoginModal", modalProps: {} }),
            },
          });
          return;
        } else if (errorMessage.includes("auth/invalid-email")) {
          showModal({
            modalType: "AlertModal",
            modalProps: {
              title: "로그인 실패",
              text: "가입되지 않은 회원입니다.",
              btnfunc: () =>
                showModal({ modalType: "LoginModal", modalProps: {} }),
            },
          });
        } else if (errorMessage.includes("wrong-password")) {
          showModal({
            modalType: "AlertModal",
            modalProps: {
              title: "로그인 실패",
              text: "비밀번호를 다시 입력해주세요.",
              btnfunc: () =>
                showModal({ modalType: "LoginModal", modalProps: {} }),
            },
          });
        }
      });
  };

  // 이메일 유효성 검사
  useEffect(() => {
    if (email)
      if (email.match(emailRegEx) === null) {
        setCheckEmail("이메일 형식을 확인해주세요.");
      } else {
        setCheckEmail("");
      }
  }, [setEmail, email]);

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
        }

        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        hideModal();
      })
      .catch((error) => {
        showModal({
          modalType: "AlertModal",
          modalProps: {
            title: "구글 로그인 취소",
            text: "구글 로그인을 취소하였습니다.",
          },
        });
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
        hideModal();
      })
      .catch((error) => {
        showModal({
          modalType: "AlertModal",
          modalProps: {
            title: "페이스북 로그인 취소",
            text: "페이스북 로그인을 취소하였습니다.",
          },
        });
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
          // url: "http://localhost:3000/api/kakao",
          data: { authObj },
        }).then(function (response: any) {
          // 서버에서 보낸 jwt토큰을 받음
          console.log("로그인 모달 : ", response);
          localStorage.setItem("data", JSON.stringify(response.data));
          console.log("로그인 모달 responseData", response.data);

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
                console.log("카카오 간편 회원가입 성공!");
              }
              hideModal();
            })
            .catch((error: any) => {
              showModal({
                modalType: "AlertModal",
                modalProps: {
                  title: "카카오 로그인 취소",
                  text: "카카오 로그인을 취소하였습니다.",
                },
              });
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

  // 모바일 해상도에서 input에 글이 들어가면, 로그인 버튼이 뜨는 함수
  const mobileHandler = () => {
    if (email || password == undefined) {
      setMobileOption(true);
    } else {
      setMobileOption(false);
    }
  };

  useEffect(() => {
    mobileHandler();
  }, [email, password]);

  // 인증메일을 받지않고 로그인창을 끄면 서비스 이용이 가능함을 확인함. 이를 해결하는 함수
  // 나가기 버튼 클릭 시, 로그아웃 시키는 함수
  const logOutClose = () => {
    if (authService.currentUser) {
      signOut(authService).then(() => {
        sessionStorage.removeItem(apiKey as string);
      });
    }
  };

  return (
    <>
      {/* 웹 */}
      <div className="hidden sm:flex fixed top-0 left-0 right-0 bottom-0 justify-center items-center flex-wrap z-10 overflow-y-scroll scrollbar-none bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] py-5">
        <div className="inner max-w-[588px] w-full py-10 bg-white z-[10]  rounded relative">
          <div className="loginContainer flex-col text-center">
            <MdOutlineClose
              onClick={() => {
                logOutClose();
                hideModal();
              }}
              className="absolute top-[32px] right-[32px] w-6 h-6 cursor-pointer duration-150 hover:text-red-400"
            />
            <h4 className="text-[32px] font-bold mt-8 mb-[29px]">로그인</h4>
            <form className="formContainer" onSubmit={signIn}>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left font-semibold">
                  이메일
                </p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  id="email"
                  defaultValue={email}
                  placeholder="이메일을 입력해주세요."
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-3 outline-none bg-[#F5F5F5] placeholder:text-phGray  duration-300 focus:scale-[1.01]"
                />
                <p className=" max-w-[472px] w-full m-auto text-right text-sm text-phGray">
                  {checkEmail ? checkEmail : null}
                </p>
              </div>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left font-semibold">
                  비밀번호
                </p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력해주세요."
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-3 outline-none bg-[#F5F5F5] placeholder:text-phGray  duration-300 focus:scale-[1.01]"
                />
                <p className=" w-[472px] m-auto mb-[22px] text-right text-textGray text-sm">
                  <span
                    onClick={() => {
                      setFindPassword(true);
                    }}
                    className="cursor-pointer duration-150 hover:text-primary"
                  >
                    비밀번호 찾기
                  </span>
                </p>
                {/* 비밀번호 찾기 */}
                {findPassword === true ? (
                  <FindPassword
                    setEmail={setEmail}
                    email={email}
                    setFindPassword={setFindPassword}
                    findPassword={findPassword}
                  />
                ) : // showModal({ modalType: "AlertModal", modalProps: {} })
                null}

                <div className="flex items-center w-[472px] m-auto">
                  <label
                    htmlFor="saveEmail"
                    className="flex items-center mb-[31px]"
                  >
                    <input
                      id="saveEmail"
                      name="saveEmail"
                      type="checkbox"
                      checked={checkedSaveEmail as boolean}
                      className="w-5 h-5 cursor-pointer"
                      onChange={() => setCheckedSaveEmail(!checkedSaveEmail)}
                    />
                    <span className="ml-2 mt-[3px] ">이메일 저장하기</span>
                  </label>
                </div>
              </div>

              <div className="buttonWrap">
                <button
                  aria-label="login"
                  className="w-[280px] h-[48px] mb-[50px] bg-primary text-white rounded "
                >
                  로그인
                </button>
              </div>

              <div className="max-w-[472px] w-full m-auto mb-10 flex items-center justify-center">
                <div className="max-w-[186px] w-full h-[1px] mr-4 bg-textGray" />
                <p className="text-sm font-semibold ">간편 로그인</p>
                <div className="max-w-[186px] w-full h-[1px] ml-4 bg-textGray" />
              </div>

              <div className="w-[280px] m-auto mb-[51px] flex items-center  justify-around">
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
                    showModal({ modalType: "JoinModal", modalProps: {} });
                  }}
                  className="cursor-pointer duration-150 hover:text-primary"
                >
                  회원가입
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="sm:hidden sm:w-full flex sm:justify-center sm:items-center">
        <div className="inner w-full h-full bg-white z-[10] fixed top-1/2 left-1/2 rounded transform -translate-x-1/2 -translate-y-1/2 overflow-auto scrollbar-none">
          <div className="loginContainer flex-col text-center">
            <MdOutlineClose
              onClick={() => {
                hideModal();
                logOutClose();
              }}
              className="absolute top-[60px] right-6 w-5 h-5 cursor-pointer duration-150 hover:text-red-400"
            />
            <h4 className="text-[24px] font-bold mt-16 mb-[23px]">로그인</h4>
            <form className="formContainer" onSubmit={signIn}>
              <div>
                <p className="max-w-[358px] w-full pl-3 m-auto mb-[2px] text-left font-bold">
                  이메일
                </p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  id="m_email"
                  // defaultValue={email}
                  placeholder="이메일을 입력해주세요."
                  className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-3 outline-none bg-[#F5F5F5] placeholder:text-phGray "
                />
                <p className="max-w-[358px] w-full m-auto text-right text-textGray text-xs">
                  {checkEmail ? checkEmail : null}
                </p>
              </div>
              <div>
                <p className="max-w-[358px] w-full pl-3 m-auto mb-[2px] text-left font-bold">
                  비밀번호
                </p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="m_password"
                  placeholder="비밀번호를 입력해주세요."
                  className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-3 outline-none bg-[#F5F5F5] placeholder:text-phGray "
                />
                <p className="max-w-[358px] w-full m-auto text-right text-phGray text-xs">
                  <span
                    onClick={() => {
                      setFindPassword(true);
                    }}
                    className="cursor-pointer duration-150 hover:text-primary"
                  >
                    비밀번호 찾기
                  </span>
                </p>
                {/* 비밀번호 찾기 */}
                {findPassword === true ? (
                  <FindPassword
                    setEmail={setEmail}
                    email={email}
                    setFindPassword={setFindPassword}
                    findPassword={findPassword}
                  />
                ) : null}

                {/* input 값 들어가면 보이는 컨텐츠 */}
                {mobileOption === true ? (
                  <div className="focusContainer block">
                    <div className="flex max-w-[358px] w-full m-auto">
                      <label
                        htmlFor="auto_login"
                        className="flex  items-center mb-[48px]"
                      >
                        <input
                          id="m_saveEmail"
                          name="saveEmail"
                          type="checkbox"
                          checked={checkedSaveEmail as boolean}
                          className="w-5 h-5 cursor-pointer"
                          onChange={() =>
                            setCheckedSaveEmail(!checkedSaveEmail)
                          }
                        />
                        <span className="ml-2 text-sm ">이메일 저장하기</span>
                      </label>
                    </div>

                    <div className="buttonWrap mb-4">
                      <button
                        aria-label="login"
                        className="w-[344px] h-[56px] mb-[29px] bg-primary text-white rounded   "
                      >
                        로그인
                      </button>
                    </div>
                  </div>
                ) : null}
                {/**  input 포커싱되면 뜨는 컨텐츠 ---여기까지*/}
              </div>

              <div className="max-w-[358px] w-full m-auto flex items-center justify-center mt-[38px] mb-[54px]">
                <div className="max-w-[110px] w-full h-[1px] mr-4 bg-textGray" />
                <p className="text-xl font-semibold ">소셜 로그인</p>
                <div className="max-w-[110px] w-full h-[1px] ml-4 bg-textGray" />
              </div>

              <div className="w-[280px] m-auto mb-[64px] flex items-center  justify-around">
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
              <div className="max-w-[203px] w-full m-auto pb-7 flex justify-center text-sm">
                <p className="text-slate-400 mr-1">아직 회원이 아니신가요?</p>
                <span
                  onClick={() => {
                    showModal({ modalType: "JoinModal", modalProps: {} });
                  }}
                  className="cursor-pointer duration-150 hover:text-primary"
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
