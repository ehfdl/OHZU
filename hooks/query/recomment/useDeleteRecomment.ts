import { removeRecomment } from "@/api/recommentAPI";
import { useMutation } from "@tanstack/react-query";

const useDeleteRecomment = (recommentId: string) => {
  return useMutation(
    ["removeRecomment", recommentId],
    (body: any) => removeRecomment(body),
    {
      onSuccess: () => {
        // console.log("답글 삭제성공");
      },
      onError: (err) => {
        console.log("답글 삭제실패", err);
      },
    }
  );
};

export default useDeleteRecomment;
