import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { dbService } from "@/firebase";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const NewList = () => {
  return (
    <div className="mt-16">
      <p className="float-left font-bold text-xl">새로운 오주</p>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="border shadow mt-3 overflow-hidden">
          <div className="bg-gray-100">
            <img
              className="flex w-full h-50"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIxBbpeIxWZedUDAvb7C2Yqp6KWkVTuOlyJA&usqp=CAU"
              alt=""
            />
          </div>
          <div className="">
            <div className="mt-5 ml-1">
              <div className="flex items-center w-full">
                <button className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer" />
                <div className="float-left">
                  <div className="text-lg font-semibold">일대일 꿀주</div>
                  <div className="text-sm font-thin">
                    <p className="text-gray-900 leading-none">오주 👑</p>
                  </div>
                </div>
                <div className="flex float-right">
                  <IoHeartOutline
                    size={23}
                    className="translate-x-20 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="font-base text-black/60 text-sm mx-3 mt-3 mb-2">
              맛있어요 맛있어요 진짜 맛있어요 맛있어요 맛있어요 진짜 맛있어요...
            </div>
          </div>
        </div>

        <div className="border shadow mt-3 overflow-hidden">
          <div className="bg-gray-100">
            <img
              className="flex w-full h-50"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIxBbpeIxWZedUDAvb7C2Yqp6KWkVTuOlyJA&usqp=CAU"
              alt=""
            />
          </div>
          <div className="">
            <div className="mt-5 ml-1">
              <div className="flex items-center w-full">
                <button className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer" />
                <div className="float-left">
                  <div className="text-lg font-semibold">일대일 꿀주</div>
                  <div className="text-sm font-thin">
                    <p className="text-gray-900 leading-none">오주 👑</p>
                  </div>
                </div>
                <div className="flex float-right">
                  <IoHeartOutline
                    size={23}
                    className="translate-x-20 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="font-base text-black/60 text-sm mx-3 mt-3 mb-2">
              맛있어요 맛있어요 진짜 맛있어요 맛있어요 맛있어요 진짜 맛있어요...
            </div>
          </div>
        </div>

        <div className="border shadow mt-3 overflow-hidden">
          <div className="bg-gray-100">
            <img
              className="flex w-full h-50"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIxBbpeIxWZedUDAvb7C2Yqp6KWkVTuOlyJA&usqp=CAU"
              alt=""
            />
          </div>
          <div className="">
            <div className="mt-5 ml-1">
              <div className="flex items-center w-full">
                <button className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer" />
                <div className="float-left">
                  <div className="text-lg font-semibold">일대일 꿀주</div>
                  <div className="text-sm font-thin">
                    <p className="text-gray-900 leading-none">오주 👑</p>
                  </div>
                </div>
                <div className="flex float-right">
                  <IoHeartSharp
                    size={23}
                    className="translate-x-20 fill-red-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="font-base text-black/60 text-sm mx-3 mt-3 mb-2">
              맛있어요 맛있어요 진짜 맛있어요 맛있어요 맛있어요 진짜 맛있어요...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewList;
