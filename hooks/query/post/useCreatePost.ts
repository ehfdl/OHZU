import { addPost } from "@/api/postAPI";
import { useMutation } from "@tanstack/react-query";

const useCreatePost = () => {
  return useMutation(["addPost"], (body: any) => addPost(body), {
    onSuccess: () => {
      // console.log("글 추가성공");
    },
    onError: (err) => {
      console.log("글 추가실패", err);
    },
  });
};

export default useCreatePost;
