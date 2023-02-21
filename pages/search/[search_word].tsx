import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Category from "@/components/main_page/Category";
import Dropdown from "@/components/dropdown";

export default function Searchword(props: any) {
  const [cate, setCate] = useState("");

  useEffect(() => {
    return () => {
      setTimeout(() => {
        console.log("검색 props : ", props.search);
      }, 1500);
    };
  }, [props.search]);

  const card = `
  <div className="card-wrap">
            <div className="card w-[384px] h-[420px] bg-slate-300 rounded">
              <div className="card-pic w-[384px] h-[284px] bg-green-300 rounded">
                <img src="/LOGO_Ohju.png" />
              </div>
              <div className="card-contents flex items-center mt-4 ml-5 relative mb-[14px]">
                <div className="profile-pic w-11 h-11 rounded-full mr-3">
                  <img src="/user.png" />
                </div>
                <div className="contents-header-wrap flex justify-around ">
                  <div className="flex flex-col">
                    <h1 className="text-[22px]">제목</h1>
                    <p className="text-[14px]">닉네임</p>
                  </div>
                  <div className="w-[18px] h-4 absolute top-[8px] right-[20px] cursor-pointer">
                    <img src="/like/like-default.png" />
                  </div>
                </div>
              </div>
              <p className="ml-5 text-[14px]">
                소개글입니다. 소개글은 최대 두 줄 입니다.
                <br />
                안녕하세요. 처음 뵙겠습니다.
              </p>
            </div>
          </div>
  `;

  return (
    <>
      <Header />
      <div className="max-w-[1200px] m-auto bg-red-300">
        <h1 className="mt-20 mb-11 text-[40px]">
          크랜베리 <span>검색결과</span>
        </h1>
        <div className="bg-slate-300 w-full flex justify-center mb-12">
          <Category setCate={setCate} />
        </div>
        <div className="inner-contents-container">
          <div className="inner-top-wrap flex justify-between items-center mb-[15px]">
            <p className="text-[20px]">
              게시글 <span>200</span>
            </p>
            <Dropdown />
          </div>
          <div className="card-wrap">
            <div className="card w-[384px] h-[420px] bg-slate-300 rounded">
              <div className="card-pic w-[384px] h-[284px] bg-green-300 rounded">
                <img src="/LOGO_Ohju.png" />
              </div>
              <div className="card-contents flex items-center mt-4 ml-5 relative mb-[14px]">
                <div className="profile-pic w-11 h-11 rounded-full mr-3">
                  <img src="/user.png" />
                </div>
                <div className="contents-header-wrap flex justify-around ">
                  <div className="flex flex-col">
                    <h1 className="text-[22px]">제목</h1>
                    <p className="text-[14px]">닉네임</p>
                  </div>
                  <div className="w-[18px] h-4 absolute top-[8px] right-[20px] cursor-pointer">
                    <img src="/like/like-default.png" />
                  </div>
                </div>
              </div>
              <p className="ml-5 text-[14px]">
                소개글입니다. 소개글은 최대 두 줄 입니다.
                <br />
                안녕하세요. 처음 뵙겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
