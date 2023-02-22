import Layout from "@/components/layout";
import ReportCommentCard from "@/components/ohzu_page/report_comment_card";
import ReportPostCard from "@/components/ohzu_page/report_post_card";
import ReportReCommentCard from "@/components/ohzu_page/report_recomment_card";
import { dbService } from "@/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Ohzu = () => {
  const [posts, setPosts] = useState<ReportPost[]>();
  const [comments, setComments] = useState<ReportComment[]>();
  const [recomments, setReComments] = useState<ReportComment[]>();

  const [cate, setCate] = useState("posts");

  const getReportPosts = async () => {
    const q = query(collection(dbService, "ReportPosts"));
    onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => {
        const newPost = {
          ...doc.data(),
        };
        return newPost;
      });
      setPosts(newPosts);
    });
  };
  const getReportComments = async () => {
    const q = query(collection(dbService, "ReportComments"));
    onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => {
        const newPost = {
          ...doc.data(),
        };
        return newPost;
      });
      setComments(newPosts);
    });
  };
  const getReportReComments = async () => {
    const q = query(collection(dbService, "ReportReComments"));
    onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => {
        const newPost = {
          ...doc.data(),
        };
        return newPost;
      });
      setReComments(newPosts);
    });
  };

  useEffect(() => {
    getReportPosts();
    getReportComments();
    getReportReComments();
  }, []);

  return (
    <Layout>
      <div className="w-full flex justify-center mb-4">
        <div className="w-[600px] h-[800px] flex flex-col overflow-y-auto">
          <div className="flex justify-between  text-3xl">
            <div
              className="bg-second text-primary px-4 py-2 rounded cursor-pointer"
              onClick={() => setCate("posts")}
            >
              posts
            </div>
            <div
              className="bg-second text-primary px-4 py-2 rounded cursor-pointer"
              onClick={() => setCate("comments")}
            >
              comments
            </div>
            <div
              className="bg-second text-primary px-4 py-2 rounded cursor-pointer"
              onClick={() => setCate("recomments")}
            >
              recomments
            </div>
          </div>
          <div className="flex flex-col w-full h-full mt-5  ">
            <div className="font-bold border-b-2 border-black px-2 py-2 text-2xl text-center">
              목록
            </div>
            {cate === "posts"
              ? posts?.map((post) => (
                  <ReportPostCard key={post.id} post={post} />
                ))
              : cate === "comments"
              ? comments?.map((comment) => (
                  <ReportCommentCard
                    key={comment.commentId}
                    comment={comment}
                  />
                ))
              : recomments?.map((comment) => (
                  <ReportReCommentCard
                    key={comment.commentId}
                    comment={comment}
                  />
                ))}
          </div>
        </div>
        <div className=""></div>
      </div>
    </Layout>
  );
};

export default Ohzu;

// r9TWnAGKsxgOoKmZf4IfCLxf0Ry2
