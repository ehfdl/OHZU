import { removePost } from "@/api/postAPI";
import { useMutation } from "@tanstack/react-query";

const useDeletePost = (postId: string) => {
  return useMutation(["removePost", postId], (body: any) => removePost(body), {
    onSuccess: () => {
      // console.log("글 삭제성공");
    },
    onError: (err) => {
      console.log("글 삭제실패", err);
    },
  });
};

export default useDeletePost;
