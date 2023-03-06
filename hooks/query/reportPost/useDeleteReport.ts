import { removeReport } from "@/api/reportPostAPI";
import { useMutation } from "@tanstack/react-query";
const useDeleteReport = ({ reportId }: { reportId: string }) => {
  return useMutation(
    ["removeReport", { reportId }],
    (body: any) => removeReport(body),
    {
      onSuccess: () => {
        // console.log("신고 삭제성공");
      },
      onError: (err) => {
        console.log("신고 삭제실패", err);
      },
    }
  );
};
export default useDeleteReport;
