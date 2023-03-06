import { addRecomment } from "@/api/recommentAPI";
import { useMutation } from "@tanstack/react-query";

const useCreateRecomment = () => {
  return useMutation(["addRecomment"], (body: any) => addRecomment(body), {
    onSuccess: () => {
      // console.log("답글 추가성공");
    },
    onError: (err) => {
      console.log("답글 추가실패", err);
    },
  });
};

export default useCreateRecomment;
