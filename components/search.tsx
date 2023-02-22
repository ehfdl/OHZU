// import { dbService } from "@/firebase";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import Fuse from "fuse.js";
// import Searchinclude from "@/pages/search/include/[search_include]";
// import Searchword from "@/pages/search/[search_word]";
// import { useRouter } from "next/router";

// const Search = ({ search, setSearch }: any) => {
//   // const [search, setSearch] = useState("");
//   console.log("search : ", search);
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const router = useRouter();

//   // 검색 데이터 불러오는 함수
//   const searchWord = async (search: any) => {
//     const data = new Fuse(posts, {
//       keys: ["title", "ingredient"],
//     });
//     console.log("data : ", data);
//     let result = data.search(search);
//     console.log("검색 데이터 : ", result);
//   };

//   // DB Posts 전체 데이터 조회
//   useEffect(() => {
//     const q = query(
//       collection(dbService, "Posts"),
//       orderBy("createdAt", "desc")
//     );
//     onSnapshot(q, (snapshot) => {
//       const newMyPosts = snapshot.docs.map((doc) => {
//         const newMyPost: PostType = {
//           postId: doc.id,
//           ...doc.data(),
//         };
//         return newMyPost;
//       });
//       setPosts(newMyPosts);
//     });
//   }, []);

//   // 검색 실행 함수
//   const SearchHanlder = (e: any) => {
//     setTimeout(() => {
//       router.push(`/search/${e}`);
//       // router.push(`/search/${posts}`);
//     }, 3000);
//   };

//   return (
//     <>
//       <form className="mr-[20px] flex items-center">
//         <label htmlFor="simple-search" className=""></label>
//         <div className="relative w-full">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg
//               aria-hidden="true"
//               className="w-5 h-5 text-gray-500 dark:text-gray-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//           </div>
//           <input
//             onChange={(e) => {
//               setSearch(e.target.value);
//               searchWord(e.target.value);
//               SearchHanlder(e.target.value);
//             }}
//             value={search}
//             type="text"
//             id="simple-search"
//             className="w-80 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[50px] focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  "
//             placeholder="혼합주 이름 또는 재료를 입력해주세요."
//             required
//           />
//         </div>
//       </form>
//       {/* <Search_page search={search} setSearch={setSearch} /> */}
//     </>
//   );
// };
// export default Search;
