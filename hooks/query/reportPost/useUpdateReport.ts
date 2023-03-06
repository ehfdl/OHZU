import { editReport } from "@/api/reportPostAPI";
import { useMutation } from "@tanstack/react-query";
const useUpdateReport = ({ reportId }: { reportId: string }) => {
  return useMutation(
    ["editReport", { reportId }],
    (body: any) => editReport(body),
    {
      onSuccess: () => {
        // console.log("신고 수정성공");
      },
      onError: (err) => {
        console.log("신고 수정실패", err);
      },
    }
  );
};
export default useUpdateReport;
