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

const PostList = ({ posts, user }: { posts: any; user: any }) => {
  const router = useRouter();
  const ref = useRef();

  // console.log({ posts });
  console.log({ user });
  return (
    <div className="mt-5">
      <div className="grid grid-cols-3 gap-4 w-full">
        {posts?.map((post: any) => (
          <div
            key={post.postId}
            className="border shadow mt-3 overflow-hidden rounded hover:border-red-100 hover:shadow-xl hover:shadow-red-300"
          >
            <Link href={`/post/${post.postId}`}>
              <div className="bg-gray-100">
                <img
                  className="flex w-full h-[284px] object-cover"
                  src={post.img}
                  alt=""
                />
              </div>
            </Link>

            <div className="h-[136px]">
              <div className="mt-5 ml-3">
                <div className="flex items-center w-full">
                  <Link href={`/users/${post.userId}`}>
                    <div className="">
                      <img
                        className="w-8 h-8 rounded-full mx-2 bg-black cursor-pointer"
                        src=""
                        alt=""
                      />
                    </div>
                  </Link>

                  <div className="float-left">
                    <div className="text-lg font-semibold">{post.title}</div>
                    {user?.map((user: any) => (
                      <div className="text-sm font-thin" key={user.userId}>
                        <p className="text-gray-900 leading-none">
                          {user.nickname}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex float-right">
                    <IoHeartOutline
                      size={23}
                      className="translate-x-[200px] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="font-base text-black/60 text-sm mx-5 mt-5 mb-2">
                {post.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
