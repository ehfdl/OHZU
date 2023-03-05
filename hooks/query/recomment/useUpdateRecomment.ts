import { editRecomment } from "@/api/recommentAPI";
import { useMutation } from "@tanstack/react-query";
const useUpdateRecomment = (commentId: string) => {
  return useMutation(
    ["editRecomment", commentId],
    (body: any) => editRecomment(body),
    {
      onSuccess: () => {
        console.log("수정성공");
      },
      onError: (err) => {
        console.log("수정실패", err);
      },
    }
  );
};
export default useUpdateRecomment;
