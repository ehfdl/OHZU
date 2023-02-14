import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";

const Category = () => {
  return (
    <div className="max-w-full flex items-center text-lg mb-2 font-thin justify-center">
      <div className="hover:border-black hover:border-b-4 pb-2 mr-7">
        <button className="bg-transparent hover:bg-transparent text-black px-7 border border-none hover:font-bold hover:border-black hover:border-b-2 ">
          전체
        </button>
      </div>
      <div className="hover:border-black hover:border-b-4 pb-2 mr-7">
        <button className="bg-transparent hover:bg-transparent text-black px-7 border border-none hover:font-bold hover:border-black hover:border-b-2 ">
          소주
        </button>
      </div>
      <div className="hover:border-black hover:border-b-4 pb-2 mr-7">
        <button className="bg-transparent hover:bg-transparent text-black px-7 border border-none hover:font-bold hover:border-black hover:border-b-2 ">
          맥주
        </button>
      </div>
      <div className="hover:border-black hover:border-b-4 pb-2 mr-7">
        <button className="bg-transparent hover:bg-transparent text-black px-7 border border-none hover:font-bold hover:border-black hover:border-b-2 ">
          양주
        </button>
      </div>
      <div className="hover:border-black hover:border-b-4 pb-2 mr-7">
        <button className="bg-transparent hover:bg-transparent text-black px-7 border border-none hover:font-bold hover:border-black hover:border-b-2 ">
          기타
        </button>
      </div>
    </div>
  );
};

export default Category;
