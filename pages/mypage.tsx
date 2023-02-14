import Layout from "@/components/layout";
import Cate_Navbar from "@/components/navbar/cate_navbar";
import Ohju_Navbar from "@/components/navbar/ohju_navbar";
import React, { useState } from "react";

const Mypage = () => {
  const [ohju, setOhju] = useState("my-ohju");
  const [cate, setCate] = useState("전체");

  console.log(cate);
  return (
    <Layout>
      <div className="w-full h-screen flex justify-center">
        <div className="w-[1200px] flex flex-col justify-start items-center">
          <div className="mt-[70px] w-[688px] flex gap-11">
            <div className="flex flex-col items-center">
              <div className="bg-[#d9d9d9] rounded-full h-[160px] w-[160px]"></div>
              <button className="mt-4">프로필 편집</button>
            </div>
            <div className="flex flex-col">
              <div className="w-[484px] flex justify-between">
                <div>
                  <div className="font-bold text-[24px]">심청이 🍺</div>
                  <div className="text-[20px] ml-1">
                    999잔 <span className="ml-[2px]">ℹ</span>
                  </div>
                </div>
                <div className="w-[264px] flex justify-between">
                  <div className="flex flex-col justify-center items-center">
                    좋아요<div>99</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    게시글<div>27</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    팔로워<div>27</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    팔로잉<div>27</div>
                  </div>
                </div>
              </div>
              <div className="h-14 mt-7 ">
                자기소개 글 자기소개 글 자기소개 글 자기소개 글 자기소개 글
                자기소개 글 자기소개 글 자기소개 글
              </div>
            </div>
          </div>
          <Ohju_Navbar setOhju={setOhju} />
          <Cate_Navbar setCate={setCate} />
          <div className="w-full mt-12 ml-[3px] text-[20px] font-bold">
            게시글 <span className="text-[#c6c6d4]">115</span>
          </div>
          <div className="w-full mt-4 bg-white grid grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200 overflow-hidden relative">
              <div className="w-full h-2/5 bg-gradient-to-b from-black to-transparent opacity-50 absolute"></div>
              <div className="absolute text-white pt-7 pl-8 font-bold text-[24px]">
                제목
              </div>
              <div className="text-[12px] bg-[#d9d9d9] ml-[92px] mt-7 h-7 w-[54px] flex justify-center items-center rounded-[20px] absolute">
                기타
              </div>
              <img
                src="https://i.ytimg.com/vi/Nec6HPObADw/maxresdefault.jpg"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 bg-slate-300"></div>
            <div className="h-64 bg-slate-400"></div>
            <div className="h-64 bg-slate-200"></div>
            <div className="h-64 bg-slate-300"></div>
            <div className="h-64 bg-slate-400"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mypage;

// 모바일

{
  /* <Layout>
      <div className="p-3">
        <div className="mt-16 h-32 w-full flex">
          <div className="w-[45%] flex flex-col items-center">
            <div className="bg-slate-200 rounded-full h-24 w-24"></div>
            <button className=" mt-1 text-sm h-4 w-24">프로필 편집</button>
          </div>

          <div className="w-[55%] flex flex-col">
            <div className="w-2/3 h-6 flex justify-between items-end">
              <div className="font-bold">심청이 🍺</div>
              <div className="text-xs mb-[3px]">
                999잔 <span className="ml-[2px]">ℹ</span>
              </div>
            </div>
            <div className="h-14 w-11/12 text-xs">
              자기소개 글 자기소개 글 자기소개 글 자기소개 글 자기소개 글
              자기소개 글 자기소개 글 자기소개 글
            </div>
            <div className="h-10 w-2/5 flex text-xs justify-between">
              <div className="flex flex-col justify-center items-center">
                좋아요<div>99</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                게시글<div>27</div>
              </div>
            </div>
          </div>
        </div>
        <div className=" mt-4 w-full flex flex-col items-center">
          <Ohju_Navbar setOhju={setOhju} />
          <Cate_Navbar setCate={setCate} />
          <div className="bg-black w-full h-8">dropdown</div>
          <div className="w-full bg-white grid grid-cols-2 gap-2">
            <div className="h-32 bg-slate-200"></div>
            <div className="h-32 bg-slate-300"></div>
            <div className="h-32 bg-slate-400"></div>
            <div className="h-32 bg-slate-200"></div>
          </div>
        </div>
      </div>
    </Layout> */
}
