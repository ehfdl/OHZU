import { editComment } from "@/api/commentAPI";
import { useMutation } from "@tanstack/react-query";
const useUpdateComment = (commentId: string) => {
  return useMutation(
    ["editComment", commentId],
    (data: any) => editComment(data),
    {
      onSuccess: () => {
        // console.log("댓글 수정성공");
      },
      onError: (err) => {
        console.log("댓글 수정실패", err);
      },
    }
  );
};
export default useUpdateComment;
