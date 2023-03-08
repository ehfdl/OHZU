import { editPost } from "@/api/postAPI";
import { useMutation } from "@tanstack/react-query";
const useUpdatePost = (postId: string) => {
  return useMutation(["editPost", postId], (body: any) => editPost(body), {
    onSuccess: () => {
      console.log("글 수정성공");
    },
    onError: (err) => {
      console.log("글 수정실패", err);
    },
  });
};
export default useUpdatePost;
