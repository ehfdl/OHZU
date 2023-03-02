import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithCustomToken,
  signInWithPopup,
} from "firebase/auth";
import {
  apiKey,
  authService,
  dbService,
  providerFacebook,
  providerGoogle,
} from "@/firebase";
import {
  collection,
  doc,
  getDoc,
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
import Image from "next/image";
import useModal from "@/hooks/useModal";

export interface JoinModalProps {}

const JoinModal = () => {
  // 이메일, 비밀번호, 비밀번호 확인, 닉네임, 유저 생년월일
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [adult, setAdult] = useState(false);
  const [userYear, setUserYear] = useState("");
  const [userMonth, setUserMonth] = useState("");
  const [userDay, setUserDay] = useState("");

  // 모바일 컨텐츠 show/hide
  const [mobileOption, setMobileOption] = useState(false);

  // 이메일, 비밀번호, 닉네임 유효성 검사
  const [checkEmail, setCheckEmail] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [checkPasswordConfirm, setCheckPasswordConfirm] = useState("");
  const [checkNickname, setCheckNickname] = useState("");
  const [checkAdult, setCheckAdult] = useState("");

  //useModal
  const { showModal, hideModal } = useModal();

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
        console.log(error.message);
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

    // 이메일 인증 구현 step
    //1.  auth에 유저가 생성되고 나서 이메일 인증을 보내고, emailVerified가 undefined면 로그아웃?
    //2.  createUserWithEmailAndPassword을 실행 시키고 나서 이메일 인증을 보내고, emailVerified가 true로 바뀌면 setDoc이 되게?

    // 회원가입 시에 로그인이 바로된다.

    // 1. 회원가입을 시킨다 (auth 등록이 되어야 emailVerified 속성에 접근가능하기 때문)
    // 2. 이메일인증메소드를 사용하여 emailVerified 속성이 true일 때 서비스를 이용가능하게. undefined이면 로그인도 못하게 막아버리게.

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
        })
          .then(() => {
            if (authService.currentUser !== null) {
              sendEmailVerification(authService.currentUser);
            }
          })
          .catch((error) => {
            let message = error.message;
            message = "형식에 맞게 작성해주세요";
            alert(message);
          });
        // alert("회원가입 성공 !");
        alert("인증 메일을 보냈습니다. 인증 후, 서비스 이용이 가능합니다.");
        showModal({ modalType: "LoginModal", modalProps: {} });
      })
      .catch((error) => {
        alert(error.massage);
      });
  };

  // 성인 인증 버튼
  const ageVerification = () => {
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    let newUserYear = Number(userYear);

    let age = nowYear - newUserYear; // ex) 2023 - 2004 => 19
    let newAge = Math.abs(age);

    if (newUserYear === 0) {
      setCheckAdult("생년월일을 확인해주세요.");
    } else if (newAge >= 19) {
      setCheckAdult("성인입니다.");
      setAdult(true);
    } else {
      setCheckAdult("성인이 아닙니다. 서비스 이용이 불가합니다.");
    }
  };

  const yearHandler = (e: any) => {
    if (e.length < 4) {
      setCheckAdult("형식에 맞게 입력해주세요.");
    } else {
      setCheckAdult(" ");
    }
  };

  // 간편 로그인
  // 구글 -> uid 생성 후, setDoc으로 document 생성하여 유저 추가.
  const googleJoin = () => {
    signInWithPopup(authService, providerGoogle)
      .then(async (result) => {
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
            alarm: [],
          });
        }
        // 로그인한 사용자 정보가 제공됩니다.
        const user = result.user;
        // 추가 정보는 getAdditionalUserInfo(result)를 사용하여 사용할 수 있습니다.
        hideModal();
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

  // 네이버
  // const { naver } = window as any;

  // const loginFormWithNaver = (props: any) => {
  //   const naverLogin = new naver.LoginWithNaverId({
  //     // 발급받은 client ID
  //     clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
  //     // app 등록 시에 callbackURL에 추가했던 URL
  //     callbackUrl: "http://localhost:3000",
  //     isPopup: false, // popup 형식으로 띄울것인지 설정
  //     loginButton: { color: "white", type: 1, height: "40" }, //버튼의 스타일, 타입, 크기를 지정
  //   });
  //     const a = naverLogin.init();
  //     console.log('네이버 로그인 이닛 : ', a)

  //     const token = location.hash;
  //     console.log("토큰 : ", token);
  //   axios({
  //     method: "POST",
  //     // url: "https://ohzu.vercel.app/api/kakao",
  //     url: "http://localhost:3000",
  //     data: { token },
  //   }).then(function (response) {
  //     // 서버에서 보낸 jwt토큰을 받음
  //     console.log(response);
  //     localStorage.setItem("data", JSON.stringify(response.data));
  //     console.log("responseData", response.data);

  //     return signInWithCustomToken(
  //       authService,
  //       `${response.data.firebaseToken}`
  //     )
  //       .then(async (userCredential) => {
  //         const user = userCredential.user;
  //         console.log("네이버 토큰 : ", response.data);
  //         sessionStorage.setItem(
  //           apiKey as string,
  //           authService.currentUser?.uid as string
  //         );

  //         const snapshot = await getDoc(
  //           doc(dbService, "Users", authService.currentUser?.uid as string)
  //         );
  //         const snapshotdata = await snapshot.data();
  //         const newProfile = {
  //           ...snapshotdata,
  //         };

  //         if (!newProfile.userId) {
  //           setDoc(
  //             doc(dbService, "Users", authService.currentUser?.uid as string),
  //             {
  //               userId: authService.currentUser?.uid,
  //               email: "",
  //               nickname: "네이버",
  //               imageURL:
  //                 "https://firebasestorage.googleapis.com/v0/b/oh-ju-79642.appspot.com/o/profile%2Fblank_profile.png?alt=media&token=0053da71-f478-44a7-ae13-320539bdf641",
  //               introduce: "",
  //               point: "",
  //               following: [],
  //               follower: [],
  //               recently: [],
  //               alarm: [],
  //             }
  //           );
  //           alert("네이버 간편 회원가입 성공!");
  //         }
  //         setJoinIsOpen(false);
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         alert(errorMessage);
  //       });
  //   });
  // };

  // 카카오
  const loginFormWithKakao = () => {
    window.Kakao.Auth.login({
      success(authObj: any) {
        // 카카오 엑세스 토큰 확인용..
        console.log("authObj : ", authObj);
        window.localStorage.setItem("token", authObj.access_token);
        axios({
          method: "POST",
          // url: "https://ohzu.vercel.app/api/kakao",
          url: "http://localhost:3000",
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
            .then(async (userCredential) => {
              const user = userCredential.user;
              console.log("카카오 토큰 : ", response.data);
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
              hideModal();
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

  // 화면 고정
  useEffect(() => {
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

  return (
    <>
      {/* 웹 */}
      <div className="hidden w-full h-screen flex absolute justify-center top-0 left-0 items-center ">
        <div className="w-full h-full fixed left-0 top-0 z-[9] bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]" />

        <div className="inner max-w-[588px] w-full max-h-[920px] h-full bg-white z-[10] rounded fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="loginContainer flex-col text-center">
            <MdOutlineClose
              onClick={() => hideModal()}
              className="absolute top-[32px] right-[32px] w-6 h-6 cursor-pointer duration-150 hover:text-red-400"
            />
            <h1 className="text-[40px] font-bold mt-[50px] mb-[19px]">
              회원가입
            </h1>
            <form className="formContainer" onSubmit={signUpForm}>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  이메일
                </p>
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                    isEmail;
                  }}
                  type="text"
                  id="email"
                  placeholder="실제 사용하는 이메일을 입력해주세요. "
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-200 focus:scale-[1.01] "
                />
                <p className="max-w-[472px] w-full m-auto mb-1 text-right text-sm text-[#999999]">
                  {checkEmail ? checkEmail : null}
                </p>
              </div>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  비밀번호
                </p>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  id="password"
                  placeholder="비밀번호는 최소 8자리로 입력해주세요."
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-200 focus:scale-[1.01]"
                />
                <p className="max-w-[472px] w-full m-auto mb-1 text-right text-sm text-[#999999]">
                  {checkPassword}
                </p>
              </div>
              <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                비밀번호 확인
              </p>
              <div>
                <input
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                  }}
                  type="password"
                  id="pwCheck"
                  placeholder="비밀번호 확인"
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-1   outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-200 focus:scale-[1.01]"
                />
                <p className="max-w-[472px] w-full m-auto mb-1 text-right text-sm text-[#999999]">
                  {checkPasswordConfirm}
                </p>
              </div>
              <div>
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  닉네임
                </p>
                <input
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  type="text"
                  id="nickname"
                  placeholder="닉네임"
                  className="max-w-[472px] w-full h-[44px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-200 focus:scale-[1.01]"
                />
                <p className="max-w-[472px] w-full m-auto mb-1 text-right text-sm text-[#999999]">
                  {checkNickname}
                </p>
              </div>
              <div className="birth_Container">
                <p className="max-w-[472px] w-full m-auto mb-[6px] text-left">
                  생년월일
                </p>
                <div className="birth_input_Wrap w-[472px] m-auto mb-[2px] flex items-center justify-between">
                  <input
                    onChange={(e) => {
                      setUserYear(e.target.value);
                      yearHandler(e.target.value);
                    }}
                    type="text"
                    placeholder="YYYY"
                    required={true}
                    minLength={4}
                    maxLength={4}
                    className="w-[144px] h-11 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
                  />
                  <input
                    onChange={(e) => {
                      setUserMonth(e.target.value);
                    }}
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    className="w-[144px] h-11 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
                  />
                  <input
                    onChange={(e) => {
                      setUserDay(e.target.value);
                    }}
                    type="text"
                    placeholder="DD"
                    maxLength={2}
                    className="w-[144px] h-11 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
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
                disabled={
                  !(
                    email &&
                    password &&
                    passwordConfirm &&
                    nickname &&
                    adult &&
                    userYear &&
                    userMonth &&
                    userDay
                  )
                }
                className="w-[280px] h-[48px] mb-[29px]  text-white rounded disabled:bg-[#aaa] valid:bg-primary"
              >
                회원가입
              </button>
              <p className="text-2xl font-bold mb-[33px]">
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
                {/* <div onClick={loginFormWithNaver} id="naverIdLogin">
                  <SiNaver className=" w-10 h-10 border border-slate-400 cursor-pointer" />
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
                <p className="text-slate-400 mr-1">이미 계정이 있으신가요?</p>
                <span
                  onClick={() => {
                    showModal({ modalType: "LoginModal", modalProps: {} });
                  }}
                  className="cursor-pointer"
                >
                  로그인
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="sm:hidden sm:w-full sm:h-auto sm:flex sm:justify-center sm:items-center">
        {/* <div className="w-full h-full fixed left-0 top-0 z-[9] bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]" /> */}

        <div className="inner w-full h-full bg-white z-[10] fixed top-1/2 left-1/2 rounded transform -translate-x-1/2 -translate-y-1/2 overflow-auto scrollbar-none">
          <div className="loginContainer flex-col text-center">
            <MdOutlineClose
              onClick={() => hideModal()}
              className="absolute top-[60px] right-6 w-5 h-5 cursor-pointer duration-150 hover:text-red-400"
            />
            <h1 className="text-[24px] font-bold mt-[100px] mb-[23px]">
              회원가입
            </h1>
            <form className="formContainer" onSubmit={signUpForm}>
              <div>
                <p className="max-w-[358px] w-full ml-7 mb-[2px] text-left font-bold">
                  이메일
                </p>
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                    isEmail;
                  }}
                  type="text"
                  id="email"
                  placeholder="실제 사용하는 이메일을 입력해주세요. "
                  className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                />
                <p className="max-w-[358px] w-full m-auto mb-5 text-right text-xs text-[#999999]">
                  {checkEmail ? checkEmail : null}
                </p>
              </div>
              <div>
                <p className="max-w-[358px] w-full ml-7 mb-[2px] text-left font-bold">
                  비밀번호
                </p>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  id="password"
                  placeholder="비밀번호는 최소 8자리로 입력해주세요."
                  className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                />
                <p className="max-w-[358px] w-full m-auto mb-5 text-right text-xs text-[#999999]">
                  {checkPassword}
                </p>
              </div>

              {/* input  입력하면 보이는 컨텐츠 */}
              {mobileOption === true ? (
                <>
                  <p className="max-w-[358px] w-full ml-7 mb-[2px] text-left font-bold">
                    비밀번호 확인
                  </p>
                  <div>
                    <input
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                      }}
                      type="password"
                      id="pwCheck"
                      placeholder="비밀번호 확인"
                      className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                    />
                    <p className="max-w-[358px] w-full m-auto mb-5 text-right text-xs text-[#999999]">
                      {checkPasswordConfirm}
                    </p>
                  </div>
                  <div>
                    <p className="max-w-[358px] w-full ml-7 mb-[2px] text-left font-bold">
                      닉네임
                    </p>
                    <input
                      onChange={(e) => {
                        setNickname(e.target.value);
                      }}
                      type="text"
                      id="nickname"
                      placeholder="닉네임"
                      className="max-w-[358px] w-full h-[56px] p-2 pl-4 mb-1 outline-none bg-[#F5F5F5] placeholder:text-[#666]  duration-300 focus:scale-[1.01]"
                    />
                    <p className="max-w-[358px] w-full m-auto mb-5 text-right text-xs text-[#999999]">
                      {checkNickname}
                    </p>
                  </div>
                  <div className="birth_Container">
                    <p className="max-w-[358px] w-full ml-7 mb-[2px] text-left font-bold">
                      생년월일
                    </p>
                    <div className="birth_input_Wrap max-w-[358px] w-full m-auto mb-6 flex items-center justify-between">
                      <input
                        onChange={(e) => {
                          setUserYear(e.target.value);
                          yearHandler(e.target.value);
                        }}
                        type="text"
                        placeholder="YYYY"
                        required={true}
                        minLength={4}
                        maxLength={4}
                        className="w-[111px] h-14 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
                      />
                      <input
                        onChange={(e) => {
                          setUserMonth(e.target.value);
                        }}
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        className="w-[111px] h-14 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
                      />
                      <input
                        onChange={(e) => {
                          setUserDay(e.target.value);
                        }}
                        type="text"
                        placeholder="DD"
                        maxLength={2}
                        className="w-[111px] h-14 text-center outline-none bg-[#F5F5F5] duration-300 focus:scale-[1.05]"
                      />
                    </div>
                    <div className="flex max-w-[358px] w-full m-auto mb-7 ">
                      <label
                        htmlFor="auto_login"
                        className="flex  items-center "
                      >
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
                    disabled={
                      !(
                        email &&
                        password &&
                        passwordConfirm &&
                        nickname &&
                        adult &&
                        userYear &&
                        userMonth &&
                        userDay
                      )
                    }
                    className="w-[344px] h-[56px] mb-[29px]  font-bold text-lg text-white rounded disabled:bg-[#aaa] valid:bg-primary"
                  >
                    회원가입
                  </button>
                </>
              ) : null}

              <div className="max-w-[358px] w-full m-auto flex items-center justify-center mt-[38px] mb-[54px]">
                <div className="max-w-[116px] w-full h-[1px] mr-4 bg-textGray" />
                <p className="text-xl font-semibold ">소셜 로그인</p>
                <div className="max-w-[116px] w-full h-[1px] ml-4 bg-textGray" />
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
              <div className="max-w-[203px] w-full m-auto pb-7 flex justify-center text-sm">
                <p className="text-slate-400 mr-1">이미 계정이 있으신가요?</p>
                <span
                  onClick={() => {
                    showModal({ modalType: "LoginModal", modalProps: {} });
                  }}
                  className="cursor-pointer"
                >
                  로그인
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default JoinModal;
