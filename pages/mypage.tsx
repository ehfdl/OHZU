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
    </Layout>
  );
};

export default Mypage;
