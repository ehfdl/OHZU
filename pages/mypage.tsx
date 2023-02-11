import Layout from "@/components/layout";
import React from "react";

export default function mypage() {
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
        <div className="bg-slate-300 mt-3 w-full h-screen flex flex-col items-center">
          <div className="bg-slate-200 w-11/12 h-7 flex justify-around">
            <div className="w-[45%] text-lg border-b-2 border-black h-full text-center font-bold">
              나만의 오주
            </div>
            <div className="w-[45%] text-lg border-b-2 border-black h-full text-center font-bold">
              좋아한 오주
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
