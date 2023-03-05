import { editUser } from "@/api/userAPI";
import { useMutation } from "@tanstack/react-query";
const useUpdateUser = (userId: string) => {
  return useMutation(["editUser", userId], (body: any) => editUser(body), {
    onSuccess: () => {
      console.log("유저 수정성공");
    },
    onError: (err) => {
      console.log("유저 수정실패", err);
    },
  });
};
export default useUpdateUser;
