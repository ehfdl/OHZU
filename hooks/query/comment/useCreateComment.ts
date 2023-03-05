import { addComment } from "@/api/commentAPI";
import { useMutation } from "@tanstack/react-query";

const useCreateComment = () => {
  return useMutation(["addComment"], (body: any) => addComment(body), {
    onSuccess: () => {
      console.log("추가성공");
    },
    onError: (err) => {
      console.log("추가실패", err);
    },
  });
};

export default useCreateComment;
