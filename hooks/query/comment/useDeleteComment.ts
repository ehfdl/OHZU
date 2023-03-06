import { removeComment } from "@/api/commentAPI";
import { useMutation } from "@tanstack/react-query";

const useDeleteComment = (commentId: string) => {
  return useMutation(
    ["removeComment", commentId],
    (body: any) => removeComment(body),
    {
      onSuccess: () => {
        // console.log("댓글 삭제성공");
      },
      onError: (err) => {
        console.log("댓글 삭제실패", err);
      },
    }
  );
};

export default useDeleteComment;
