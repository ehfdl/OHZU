import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { dbService } from "@/firebase";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const AllList = ({ posts }: { posts: any }) => {
  const router = useRouter();
  const ref = useRef();

  // console.log({ posts });

  return (
    <div className="mt-5">
      <p className="float-left font-bold text-xl">전체 게시글</p>
      <span className="float-left ml-2 pt-0.5 font-base text-base text-gray-400">
        300
      </span>

      <div className="grid grid-cols-3 gap-4 w-full">
        {posts?.map((post) => (
          <Link href={`/post/${post.postId}`}>
            <div
              key={post.postId}
              className="border shadow mt-3 overflow-hidden rounded-md"
            >
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
                      <div className="text-lg font-semibold">{post.title}</div>
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
                  맛있어요 맛있어요 진짜 맛있어요 맛있어요 맛있어요 진짜
                  맛있어요...
                </div>
              </div>
            </div>
          </Link>
        ))}

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

export default AllList;
